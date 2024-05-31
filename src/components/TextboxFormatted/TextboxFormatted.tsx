import UniversimeApi from '@/services/UniversimeApi';
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

const TextboxFormatted = ({ value, onChange }: {value: string, onChange: ((value: string) => void)}) => {

  const formats = useMemo(() => ([
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

  const modules = useMemo(() => ({
    imageActions: {},
    imageFormats: {},
    toolbar: [
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
                  if(res.success && res.body) {
                    resolve(isAbsoluteUrl(res.body.link) ? res.body.link : import.meta.env.VITE_UNIVERSIME_API + res.body.link)
                  } else {
                    reject()
                  }
                }catch(e) {
                  reject()
                }
            });
        },
    },
  }), []);



  return (
    <ReactQuill formats={formats} modules={modules} theme="snow" value={value} onChange={onChange} />
  );
};

export default TextboxFormatted;