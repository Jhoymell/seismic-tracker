import React from 'react';
import { Button } from '@mui/material';

// Esta es la barra de herramientas para nuestro editor Tiptap
const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="menubar">
      <Button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
        Negrita
      </Button>
      <Button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
        Itálica
      </Button>
      <Button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>
        Lista
      </Button>
      {/* Aquí podríamos añadir muchos más botones */}
    </div>
  );
};
export default MenuBar;