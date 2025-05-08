import React, { useEffect, useRef } from 'react';
import 'trix/dist/trix.css';
import 'trix';

// Add TypeScript declaration for trix-editor custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'trix-editor': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        input: string;
        onTrixChange?: (event: CustomEvent) => void;
        placeholder?: string;
        class?: string;
      };
    }
  }
}

interface TrixEditorProps {
  nameInput: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const TrixEditor: React.FC<TrixEditorProps> = ({
  nameInput,
  value = '',
  onChange,
  placeholder,
  className
}) => {
  const inputId = `trix-input-${nameInput}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Initialize Trix editor
    const editorElement = editorRef.current;
    if (editorElement) {
      const handleTrixChange = (event: Event) => {
        // The event target is the trix-editor element itself
        const editor = event.target as HTMLElement;
        console.log('Content changed:', editor.innerHTML);

        // Call onChange handler with the input value
        if (onChange && inputRef.current) {
          onChange(inputRef.current.value);
        }
      };

      // Add event listener
      editorElement.addEventListener('trix-change', handleTrixChange);

      // Clean up
      return () => {
        editorElement.removeEventListener('trix-change', handleTrixChange);
      };
    }
  }, [onChange]);

  // Set initial value if provided
  useEffect(() => {
    const inputElement = inputRef.current;
    if (inputElement && value) {
      inputElement.value = value;

      // If the Trix editor is already initialized, we need to update its content
      const editorElement = editorRef.current;
      if (editorElement) {
        // Access the Trix editor API and set the HTML
        const trixEditor = (editorElement as any).editor;
        if (trixEditor) {
          trixEditor.loadHTML(value);
        }
      }
    }
  }, [value]);

  return (
    <div className="">
      <input 
        id={inputId} 
        type="hidden" 
        name={nameInput} 
        ref={inputRef}
        defaultValue={value}
      />
      <trix-editor 
        ref={editorRef}
        input={inputId}
        placeholder={placeholder}
        class={className}
      ></trix-editor>
    </div>
  );
};

export default TrixEditor;