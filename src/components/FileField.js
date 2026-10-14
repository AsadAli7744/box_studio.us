import { FILE_ACCEPT, formatBytes, isImageType } from '../utils/files';

export default function FileField({ files, onAdd, onRemove, errors }) {
  return (
    <div className="file-field">
      <label className="dropzone">
        <span>Add reference images or a PDF</span>
        <small>JPG, PNG, WEBP, or PDF. Up to 8 MB each, and up to 6 files.</small>
        <input
          type="file"
          accept={FILE_ACCEPT}
          multiple
          onChange={(event) => {
            onAdd(event.target.files);
            event.target.value = '';
          }}
        />
      </label>
      {errors?.length ? (
        <ul className="file-errors">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}
      {files.length ? (
        <ul className="file-list">
          {files.map((file) => (
            <li key={file.id}>
              {file.previewUrl && isImageType(file.type) ? (
                <img src={file.previewUrl} alt="" />
              ) : (
                <span className="file-badge">PDF</span>
              )}
              <span>
                <strong>{file.name}</strong>
                <small>{formatBytes(file.size)}</small>
              </span>
              <button type="button" onClick={() => onRemove(file.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
