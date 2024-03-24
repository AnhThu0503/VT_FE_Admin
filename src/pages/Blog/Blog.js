import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";

const Blog = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [valueEditor, setValueEditor] = useState("");
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    setValueEditor(
      convertToRaw(editorState.getCurrentContent()).blocks[0].text
    );
  };

  console.log(valueEditor);
  //   console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));

  return (
    <div>
      <div>Tieu de: "123123"</div>
      <div>Thong Tin: "123123123"</div>
      <div>Hinh anh: "123123123"</div>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={onEditorStateChange}
      />
    </div>
  );
};

export default Blog;
