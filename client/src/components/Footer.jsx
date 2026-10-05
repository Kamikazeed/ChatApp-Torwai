import { footer_data } from '../assets/assets'

const Footer = () => {

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 bg-white/10 backdrop-blur-xl border-t-2 border-gray-500'>
      <div className='py-6 border-b border-gray-500/30'>
        <div className='flex flex-wrap justify-center items-center gap-x-8 gap-y-3'>
          {footer_data.map((item, index) => (
            <a className='flex items-center gap-[6px] cursor-pointer' key={index} href={item.link} aria-label={item.title} title={item.title} target={item.target}>
              <img className='w-6 h-6 sm:h-8 sm:w-8' src={item.icon} alt='logo'/>
              <span className='text-sm sm:text-lg font-medium text-white dark:text-text-primary-dark/70'>{item.title}</span>
            </a>
          ))}
        </div>
      </div>
      <p className='py-4 text-center text-sm md:text-base text-white/80'>Copyright 2026 © Torwai - All Right Reserved.</p>
    </div>
  )
}

export default Footer
