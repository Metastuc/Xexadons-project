export default function PrimaryButton({ text, clickHandler }) {
    return (
        <button type="button" onClick={clickHandler} className="px-4 h-[3rem] border border-primary-blue rounded-3xl text-primary-blue">
            {text}
        </button>
    );
}