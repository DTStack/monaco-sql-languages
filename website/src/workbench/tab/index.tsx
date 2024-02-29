import { IEditorTab, IMenuItemProps, UniqueId, components, controllers } from '@dtinsight/molecule';
import { Actions, Container, EditorWrapper, Header, Name, Text, Title } from './styled';
import { editor } from 'monaco-editor';
import { createElement, useEffect, useMemo, useRef } from 'react';
import useEdit from '../../hooks/useEdit';
import { emit } from '../../storage/tmp';
import { EVENTS } from '../../const';
import { helper } from '../../components/icon/helper';

interface ITabProps
	extends Pick<
		controllers.editor.IEditorController,
		'onMount' | 'onModelMount' | 'onToolbarClick'
	> {
	data: IEditorTab<any>;
	instance?: editor.IStandaloneCodeEditor;
	groupId: UniqueId;
	options: editor.IEditorOptions;
	toolbar: IMenuItemProps[];
}

export default function Tab({
	data,
	groupId,
	toolbar,
	instance,
	options,
	onModelMount,
	onMount,
	onToolbarClick
}: ITabProps) {
	const edit = useEdit();
	const ref = useRef<HTMLDivElement>(null);

	const viewState = useRef(new WeakMap());
	const handleMount = (editor: editor.IStandaloneCodeEditor) => {
		onMount?.(groupId, editor);

		editor.onDidChangeModel(() => {
			const model = editor.getModel();
			if (model) {
				const state = viewState.current.get(model);
				if (state) {
					editor.restoreViewState(state);
					editor.focus();
				}
			}
		});

		editor.onDidBlurEditorText(() => {
			const model = editor.getModel();
			if (model) {
				viewState.current.set(model, editor.saveViewState());
			}
		});
	};

	const handleModelMount = (model: editor.ITextModel) => {
		if (!data) return;
		if (!data.model) {
			onModelMount?.(data.id, groupId, model);
		}
	};

	const handleSubmit = () => {
		// FIXME: Molecule 应该支持把事件抛出去
		edit.stop();
		if (ref.current) {
			ref.current.style.removeProperty('width');
		}
		emit(EVENTS.UPDATE_NAME, edit.data);
	};

	const handleEdit = () => {
		// 由于 Input 的内容会内陷，实现 input 的宽度和 text 的文案宽度保持一致
		if (ref.current) {
			const { width } = ref.current.getBoundingClientRect();
			ref.current.style.setProperty('width', `${width}px`);
		}
		edit.start(data.name || '');
	};

	useEffect(() => {
		edit.stop();
		if (ref.current) {
			ref.current.style.removeProperty('width');
		}
	}, [data]);

	const icon = useMemo(() => {
		return createElement(helper(data.language));
	}, [data]);

	return (
		<Container>
			<Header>
				<Title>
					<components.Icon type={icon} />
					<Name ref={ref}>
						{edit.editing ? (
							<components.Input
								autoFocus
								value={edit.data}
								onChange={edit.dispatch}
								onBlur={handleSubmit}
								onSubmit={handleSubmit}
							/>
						) : (
							<Text title={data.name} onClick={handleEdit}>
								{data.name}
							</Text>
						)}
					</Name>
					{data.modified && <components.Icon type="primitive-dot" />}
				</Title>
				<Actions>
					<components.ActionBar
						data={toolbar}
						onClick={(item) => onToolbarClick?.(item, groupId)}
					/>
				</Actions>
			</Header>
			<EditorWrapper>
				<components.MonacoEditor
					options={{
						...options,
						automaticLayout: true
					}}
					instance={instance}
					model={data?.model}
					value={data?.value}
					language={data?.language}
					onMount={handleMount}
					onModelMount={handleModelMount}
				/>
			</EditorWrapper>
		</Container>
	);
}
