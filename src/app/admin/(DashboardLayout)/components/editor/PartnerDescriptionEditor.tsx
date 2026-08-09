import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

const MAX_CHARS = 256;

interface Props {
  onChange: (data: any) => void;
  initialData?: any;
  holderId?: string;
  minimal?: boolean; // ← новий проп: лише текст, без header/marker
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

export default function PartnerDescriptionEditor({ onChange, initialData, holderId, minimal }: Props) {
  const editorRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);
  const holderRef = useRef(holderId ?? `editorjs-partner-${Math.random().toString(36).slice(2)}`);
  const [charCount, setCharCount] = useState(() => countChars(initialData));

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let isMounted = true;

    async function initEditor() {
      const imports: any[] = [
        import("@editorjs/editorjs"),
        import("@editorjs/list"),
      ];
      if (!minimal) {
        imports.push(import("@editorjs/header"), import("@editorjs/marker"));
      }

      const results = await Promise.all(imports);
      const { default: EditorJS } = results[0];
      const { default: List } = results[1];
      const Header = !minimal ? results[2].default : undefined;
      const Marker = !minimal ? results[3].default : undefined;

      if (!isMounted) return;

      if (editorRef.current?.destroy) {
        await editorRef.current.destroy();
        editorRef.current = null;
      }

      const tools: any = {
        paragraph: {
          inlineToolbar: true,
          config: { preserveBlank: true, placeholder: "Description..." },
        },
        list: List as any,
      };
      if (!minimal) {
        tools.header = { class: Header, config: { levels: [3, 4], defaultLevel: 4 } };
        tools.marker = Marker;
      }

      const editor = new EditorJS({
        holder: holderRef.current,
        inlineToolbar: minimal ? ["bold", "italic", "link"] : ["bold", "italic", "marker", "link"],
        data: initialData ?? { blocks: [] },
        tools,
        async onChange(api: any) {
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