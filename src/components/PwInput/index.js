import styles from "./styles.module.css";

export default function index({ text, value, setState }) {
  return (
    <div className={styles.container}>
      <input
        type="password"
        value={value}
        onChange={(e) => setState(e.target.value)}
        id={text}
      />
      <label htmlFor={text}>{text}</label>
    </div>
  );
}
