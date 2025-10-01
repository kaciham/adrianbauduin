import React from 'react';

const TopIcon = () => {

    //   const [scrolled, setScrolled] = useState(false)
    
    //   useEffect(() => {
    //     const handleScroll = () => {
    //       setScrolled(window.scrollY > window.innerHeight * 1)
    //     }
    //     window.addEventListener('scroll', handleScroll)
    //     return () => window.removeEventListener('scroll', handleScroll)
    //   }, [])

    // const scrollToTop = () => {
    //     if (scrolled) {
    //         window.scrollTo({ top: 0, behavior: 'smooth' });
    //     }
    // };

    return (

            <div className="cursor-pointer flex justify-center items-center w-full h-full ">
                <svg className='w-full h-full fill-dark' viewBox="0 0 24 24">
                    <path d="M12 4l-8 8h5v8h6v-8h5l-8-8z"/>
                </svg>
            </div>
        )
    
};

export default TopIcon;