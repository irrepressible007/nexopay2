import { motion } from 'framer-motion';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <motion.button
            {...props}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={
                `inline-flex items-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 ease-in-out hover:from-indigo-500 hover:to-purple-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                    disabled && 'opacity-50 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </motion.button>
    );
}
