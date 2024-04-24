export default function Button({ text, clickHandler }) {
    return (
        <button
            type="button"
            onClick={clickHandler}
            className="px-4 min-w-[7rem] h-[3rem] bg-main rounded-3xl text-white"
        >
            {text}
        </button>
    );
}
