import { useEffect, useRef } from "react";
import { FontSizeTool } from "./FontSizeTool";
import { TextColorTool, BgColorTool } from "./ColorTool";

interface ReactEditorProps {
  onChange: (data: any) => void;
  initialData?: any;
}

export default function ReactEditor({ onChange, initialData }: ReactEditorProps) {
  const editorRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

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
        { default: Marker },
        { default: SimpleImage },
      ] = await Promise.all([
        import("@editorjs/editorjs"),
        import("@editorjs/header"),
        import("@editorjs/list"),
        import("@editorjs/embed"),
        import("@editorjs/link"),
        import("@editorjs/image"),
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
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const formData = new FormData();
                  formData.append("file", file);

                  const res = await fetch("/api/media", {
                    method: "POST",
                    body: formData,
                  });

                  if (!res.ok) return { success: 0 };

                  const data = await res.json();

                  return {
                    success: 1,
                    file: {
                      url: data.url,
                    },
                  };
                },

                async uploadByUrl(url: string) {
                  return {
                    success: 1,
                    file: { url },
                  };
                },
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

  return <div id="editorjs" />;
}