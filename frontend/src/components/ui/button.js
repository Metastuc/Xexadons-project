export default function Button({ text, clickHandler }) {
    return (
        <button
            type="button"
            onClick={clickHandler}
            className="px-4 h-[3rem] bg-main rounded-3xl text-white"
        >
            {text}
        </button>
    );
}
