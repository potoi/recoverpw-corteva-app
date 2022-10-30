import styles from "./styles.module.css";

export default function index({ text, onClick }) {
  return (
    <button className={styles.sendButton} type="submit">
      {text}
    </button>
  );
}
