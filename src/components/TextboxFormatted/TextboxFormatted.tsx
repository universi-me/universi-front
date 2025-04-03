import { UniversimeApi } from "@/services"
import { isAbsoluteUrl } from '@/utils/regexUtils';
import { useMemo, useRef } from 'react';

import ReactQuill, { Quill } from "react-quill-new"
import { ImageActions } from '@xeger/quill-image-actions';
import BlotFormatter from 'quill-blot-formatter';
import ImageUploader from "quill-image-uploader";

import './TextboxFormatted.less'
import { HttpStatusCode } from "axios";

Quill.register('modules/imageUploader', ImageUploader);
Quill.register('modules/imageActions', ImageActions);
Quill.register('modules/blotFormatter', BlotFormatter);


interface TextboxFormattedProps {
  value: string;
  imageUploadPublic?: boolean;
  onChange: (value: string) => void;
  theme?: string;
  modules?: object;
  formats?: string[];
  toolbar?: any;
}

const TextboxFormatted = ({ value, onChange, theme = 'snow', modules: customModules, formats: customFormats, toolbar: customtToolbar, ...props }: TextboxFormattedProps) => {
  const quillRef = useRef<any>(null);


  const defaultFormats = useMemo(() => ([
    "align",
    "background",
    "blockquote",
    "list",
    "bold",
    "code-block",
    "color",
    "font",
    "header",
    "image",
    "imageBlot",
    "italic",
    "link",
    "script",
    "strike",
    "size",
    "underline"
  ]), []);

  const formats = customFormats || defaultFormats;

  const defaultModules = useMemo(() => ({
    imageActions: {},
    blotFormatter: {
      align: {
        defaultAlignment: 'center',
      },
    },
    toolbar: customtToolbar || [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike",],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        
        ["clean"],
        ["blockquote", "code-block"],
        ["image", "link",],
    ],
    imageUploader: {
        upload: (file : File) => {
            return new Promise(async (resolve, reject) => {
                try {
                  let res = await UniversimeApi.Image.upload({image: file, isPublic: props.imageUploadPublic});
                  if(res.isSuccess() && res.status === HttpStatusCode.Created) {
                    resolve(isAbsoluteUrl(res.data) ? res.data : import.meta.env.VITE_UNIVERSIME_API + '/img/' + res.data );
                  } else {
                    reject( new Error( res.errorMessage ) )
                  }
                }catch(e) {
                  reject( new Error( String( e ) ) )
                }
            });
        },
    },
  }), []);

  const modules = customModules ?? defaultModules;

  
  // set new image inserted centered position as default
  const handleChange = (content: string, delta: any, source: string, editor: any) => {
    onChange(content);

    var editorCurr = quillRef.current?.getEditor();
    if (!editorCurr) return;
  
    if (source === "user") {
      delta.ops.forEach((op: any) => {
        if (op.insert && op.insert.image) {
          var imgUrl = op.insert.image;
          var quillEditor = editorCurr;
          var images = quillEditor.container.querySelectorAll(`img[src="${imgUrl}"]`);
          images.forEach((img: HTMLImageElement) => {
            if(img.tagName === "IMG") {
              var parent = img.parentElement;
              if ((!parent || !parent.classList.contains("ql-align-center")) && (!parent || (parent && parent.tagName === "P"))) {
                var wrapper = document.createElement("p");
                wrapper.classList.add("ql-align-center");
                img.replaceWith(wrapper);
                wrapper.appendChild(img);
                // update back the content with actual changes
                handleChange(editorCurr.root.innerHTML, delta, "api", editorCurr);
              }
            }
          });
        }
      });
    }

  };
  
  

  return (
    <ReactQuill ref={quillRef} formats={formats} modules={modules as any} theme={theme} value={value} onChange={handleChange} {...props} />
  );
};

export default TextboxFormatted;