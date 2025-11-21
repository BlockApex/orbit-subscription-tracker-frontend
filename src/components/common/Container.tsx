import React from 'react'


interface ContainerProps {
    children: React.ReactNode;
    bg?: string;
}
const Container: React.FC<ContainerProps> = ({ children, bg = '#FFFFF' }) => {
    return (
        <main className={`max-w-full lg:max-w-3xl mx-auto bg-[${bg}]  relative`}>
            {children}
        </main>
    )
}

export default Container