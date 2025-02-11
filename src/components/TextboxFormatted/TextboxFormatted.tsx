import { UniversimeApi } from "@/services"
import { isAbsoluteUrl } from '@/utils/regexUtils';
import { useMemo } from 'react';

import ReactQuill, { Quill } from "react-quill"
import { ImageActions } from '@xeger/quill-image-actions';
import { ImageFormats } from '@xeger/quill-image-formats';
import ImageUploader from "quill-image-uploader";

import 'react-quill/dist/quill.snow.css'
import 'quill-image-uploader/dist/quill.imageUploader.min.css'

import './TextboxFormatted.less'

Quill.register('modules/imageUploader', ImageUploader);
Quill.register('modules/imageActions', ImageActions);
Quill.register('modules/imageFormats', ImageFormats);


interface TextboxFormattedProps {
  value: string;
  onChange: (value: string) => void;
  theme?: string;
  modules?: object;
  formats?: string[];
  toolbar?: any;
}

const TextboxFormatted = ({ value, onChange, theme = 'snow', modules: customModules, formats: customFormats, toolbar: customtToolbar, ...props }: TextboxFormattedProps) => {

  const defaultFormats = useMemo(() => ([
    "align",
    "background",
    "blockquote",
    "list",
    "bold",
    "code-block",
    "color",
    "float",
    "font",
    "header",
    "height",
    "image",
    "imageBlot",
    "italic",
    "link",
    "script",
    "strike",
    "size",
    "underline",
    "width"
  ]), []);

  const formats = customFormats || defaultFormats;

  const defaultModules = useMemo(() => ({
    imageActions: {},
    imageFormats: {},
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
                  let res = await UniversimeApi.Image.upload({image: file})
                  if(res.isSuccess()) {
                    resolve(isAbsoluteUrl(res.data) ? res.data : import.meta.env.VITE_UNIVERSIME_API + res.data );
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


  return (
    <ReactQuill formats={formats} modules={modules} theme={theme} value={value} onChange={onChange} {...props} />
  );
};

export default TextboxFormatted;