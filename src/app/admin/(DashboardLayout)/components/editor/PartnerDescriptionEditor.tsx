import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

const MAX_CHARS = 256;

interface Props {
  onChange: (data: any) => void;
  initialData?: any;
}

function countChars(data: any): number {
  if (!data?.blocks) return 0;
  return data.blocks
    .map((b: any) => {
      if (b.type === "paragraph" || b.type === "header") {
        return (b.data?.text ?? "").replace(/<[^>]*>/g, "").length;
      }
      if (b.type === "list") {
        return (b.data?.items ?? []).join("").replace(/<[^>]*>/g, "").length;
      }
      return 0;
    })
    .reduce((a: number, b: number) => a + b, 0);
}

export default function PartnerDescriptionEditor({ onChange, initialData }: Props) {
  const editorRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);
  const holderRef = useRef(`editorjs-partner-${Math.random().toString(36).slice(2)}`);
  const [charCount, setCharCount] = useState(() => countChars(initialData));

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
        { default: Marker },
      ] = await Promise.all([
        import("@editorjs/editorjs"),
        import("@editorjs/header"),
        import("@editorjs/list"),
        import("@editorjs/marker"),
      ]);

      if (!isMounted) return;

      if (editorRef.current?.destroy) {
        await editorRef.current.destroy();
        editorRef.current = null;
      }

      const editor = new EditorJS({
        holder: holderRef.current,
        inlineToolbar: ["bold", "italic", "marker", "link"],
        data: initialData ?? { blocks: [] },
        tools: {
          paragraph: {
            inlineToolbar: true,
            config: { preserveBlank: true, placeholder: "Description..." },
          },
          header: {
            class: Header as any,
            config: { levels: [3, 4], defaultLevel: 4 },
          },
          list: List as any,
          marker: Marker as any,
        },
        async onChange(api) {
          const data = await api.saver.save();
          const chars = countChars(data);
          setCharCount(chars);
          onChangeRef.current(data);
        },
      });

      editorRef.current = editor;
      setCharCount(countChars(initialData));
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

  const isOver = charCount > MAX_CHARS;

  return (
    <Box>
      <Box
        sx={{
          border: "1px solid",
          borderColor: isOver ? "error.main" : "divider",
          borderRadius: 2,
          p: 2,
          minHeight: 120,
        }}
      >
        <div id={holderRef.current} />
      </Box>
      <Box display="flex" justifyContent="flex-end" mt={0.5}>
        <Typography
          variant="caption"
          color={isOver ? "error" : charCount > MAX_CHARS * 0.85 ? "warning.main" : "text.secondary"}
        >
          {charCount} / {MAX_CHARS}
        </Typography>
      </Box>
    </Box>
  );
}