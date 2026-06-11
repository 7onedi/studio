import { useEffect, useRef, useState } from "react";
import { FontSizeTool } from "./FontSizeTool";
import { TextColorTool, BgColorTool } from "./ColorTool";
import { CustomImageTool } from "./CustomImageTool";
import MediaPickerDialog, { MediaItem } from '../Mediapickerdialog'; 
import { CustomGalleryTool } from "./CustomGalleryTool";
import { CustomImageBlockTool } from "./CustomImageBlockTool";

interface ReactEditorProps {
  onChange: (data: any) => void;
  initialData?: any;
  onImageUpload?: (mediaId: number, url: string) => void;
}


export default function ReactEditor({ onChange, initialData, onImageUpload }: ReactEditorProps) {
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

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

    useEffect(() => {
    onImageUploadRef.current = onImageUpload;
  }, [onImageUpload]);

  useEffect(() => {
    let isMounted = true;

    async function initEditor() {
      const [
        { default: EditorJS },
        { default: Header },
        { default: List },
        { default: Embed },
        { default: LinkTool },
        { default: ImageTool },
        { default: Gallery },
        { default: Marker },
        { default: SimpleImage },
      ] = await Promise.all([
        import("@editorjs/editorjs"),
        import("@editorjs/header"),
        import("@editorjs/list"),
        import("@editorjs/embed"),
        import("@editorjs/link"),
        import("@editorjs/image"),
        import("editorjs-gallery"),
        import("@editorjs/marker"),
        import("@editorjs/simple-image"),
      ]);


      if (!isMounted) return;

      if (editorRef.current?.destroy) {
        await editorRef.current.destroy();
        editorRef.current = null;
      }

      const editor = new EditorJS({
        holder: "editorjs",
        inlineToolbar: true,
        data: initialData ?? { blocks: [] }, // ← додай це
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
              uploader: {
                async uploadByFile(file: File) {
                  const formData = new FormData();
                  formData.append("file", file);
                  const res = await fetch("/api/media", { method: "POST", body: formData, credentials: "include" });
                  if (!res.ok) return { success: 0 };
                  const data = await res.json();
                  onImageUploadRef.current?.(data.id, data.url);
                  return { success: 1, file: { url: data.url } };
                },
                async uploadByUrl(url: string) {
                  return { success: 1, file: { url } };
                },
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
      <div id="editorjs" />
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