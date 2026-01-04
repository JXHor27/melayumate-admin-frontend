import {FaRegWindowClose } from 'react-icons/fa';

function CreateLessonForm({ open, formData, onFormDataChange, onClose, onSubmit }) {
    return (
        <div className={`fixed top-0 left-0 h-full w-75 bg-slate-300 dark:bg-zinc-900 text-black dark:text-white shadow-lg transform transition-transform duration-300 z-50 ${open ? '-translate-x-0' : '-translate-x-full'}`}>
            <div className="p-4 flex justify-between items-start border-b-1 border-zinc-600">
                <h3 className="text-lg font-semibold">New Lesson</h3>
                    <button onClick={onClose} className="text-black dark:text-white text-xl hover:text-red-400 cursor-pointer">
                        <FaRegWindowClose size={29}/>
                    </button>
             </div>
            <div className="p-4">
                <input
                    type="text"
                    maxLength={30}
                    placeholder="Title"
                    className="w-full p-2 mb-1 rounded bg-slate-100 dark:bg-zinc-700 border border-zinc-600"
                    value={formData.title}
                    onChange={(e) => onFormDataChange({ ...formData, title: e.target.value })}
                />
                <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-5">{formData.title.length}/30 characters</p>
                <textarea
                    placeholder="Description (Optional)"
                    maxLength={60}
                    className="h-40 w-full p-2 rounded bg-slate-100 dark:bg-zinc-700 border border-zinc-600"
                    value={formData.description}
                    onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
                />
                <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-5">{formData.description.length}/60 characters</p>
                    <button
                        onClick={onSubmit}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full cursor-pointer"
                    >
                    Submit
                    </button>
            </div>
        </div>
    )
}

export default CreateLessonForm;