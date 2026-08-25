import { useEffect, useRef, useState } from "react";
import { FontSizeTool } from "./FontSizeTool";
import { TextColorTool, BgColorTool } from "./ColorTool";
import { CustomImageTool } from "./CustomImageTool";
import MediaPickerDialog, { MediaItem } from '../Mediapickerdialog'; 
import { CustomGalleryTool } from "./CustomGalleryTool";
import { CustomImageBlockTool } from "./CustomImageBlockTool";

export interface ReactEditorHandle {
  save: () => Promise<any>;
}

interface ReactEditorProps {
  onChange: (data: any) => void;
  initialData?: any;
  onImageUpload?: (mediaId: number, url: string) => void;
  onImageValidityChange?: (blockId: string | null, isValid: boolean) => void; // ← додати
  holderId?: string;
  onReady?: (handle: ReactEditorHandle) => void;
}

export default function ReactEditor({ onChange, initialData, onImageUpload, onImageValidityChange, holderId = 'editorjs', onReady }: ReactEditorProps) {
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const mediaPickerResolveRef = useRef<((item: MediaItem) => void) | null>(null);

  useEffect(() => {
    (window as any).__openMediaPicker = () => new Promise<MediaItem>((resolve) => {
      mediaPickerResolveRef.current = resolve;
      setMediaPickerOpen(true);
    });
    return () => { delete (window as any).__openMediaPicker; };
  }, []);
  const editorRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);
  const onImageUploadRef = useRef(onImageUpload);
  const onReadyRef = useRef(onReady);
  const onImageValidityChangeRef = useRef(onImageValidityChange);

  useEffect(() => {
    onImageValidityChangeRef.current = onImageValidityChange;
  }, [onImageValidityChange]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onImageUploadRef.current = onImageUpload;
  }, [onImageUpload]);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    let isMounted = true;

    async function initEditor() {
      const [
        { default: EditorJS },
        { default: Header },
        { default: List },
        { default: Embed },
        { default: LinkTool },
        { default: SimpleImage },
      ] = await Promise.all([
        import("@editorjs/editorjs"),
        import("@editorjs/header"),
        import("@editorjs/list"),
        import("@editorjs/embed"),
        import("@editorjs/link"),
        import("@editorjs/simple-image"),
      ]);

      if (!isMounted) return;

      if (editorRef.current?.destroy) {
        await editorRef.current.destroy();
        editorRef.current = null;
      }

      const editor = new EditorJS({
        holder: holderId,
        inlineToolbar: true,
        data: initialData ?? { blocks: [] },
        tools: {
          paragraph: {
            inlineToolbar: true,
            config: {
              preserveBlank: true,
              placeholder: "Type your text here...",
            }
          },
          textColor: TextColorTool,
          bgColor: BgColorTool,
          header: Header,
          list: List,
          embed: Embed,
          linkTool: LinkTool,
          image: {
            class: CustomImageBlockTool,
            config: {
              onUpload: (id: number, url: string) => {
                onImageUploadRef.current?.(id, url);
              },
            },
          },
          gallery: {
            class: CustomGalleryTool,
            config: {
              onUpload: (id: number, url: string) => {
                onImageUploadRef.current?.(id, url);
              },
            },
          },
          customImage: {
            class: CustomImageTool,
            config: {
              onUpload: (id: number, url: string) => {
                onImageUploadRef.current?.(id, url);
              },
              onValidityChange: (blockId: string | null, isValid: boolean) => {
                onImageValidityChangeRef.current?.(blockId, isValid);
              },
            },
          },
          fontSize: FontSizeTool,
          simpleImage: SimpleImage,
        },
        async onChange(api) {
          const data = await api.saver.save();
          onChangeRef.current(data);
        },
      });

      editorRef.current = editor;

      onReadyRef.current?.({
        save: async () => {
          if (!editorRef.current) return initialData ?? { blocks: [] };
          return editorRef.current.save();
        },
      });
    }

    initEditor();

    return () => {
      isMounted = false;
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
      }
      editorRef.current = null;
    };
  }, []);

  return (
    <>
      <div id={holderId} />
      <MediaPickerDialog
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        selected={null}
        onSelect={(item) => {
          setMediaPickerOpen(false);
          mediaPickerResolveRef.current?.(item);
          mediaPickerResolveRef.current = null;
        }}
      />
    </>
  );
}