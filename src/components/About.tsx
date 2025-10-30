import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import AnimatedText from "./AnimatedText";

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const images = ["/Yuta.jpg", "/SDG 14.png", "/SDG 16.png"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 px-6 md:px-12 bg-black" id="about">
      <div className="container mx-auto max-w-5xl" ref={ref}>
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            className="md:w-1/2"
            initial={{
              opacity: 0,
              x: -50,
            }}
            animate={
              inView
                ? {
                    opacity: 1,
                    x: 0,
                  }
                : {
                    opacity: 0,
                    x: -50,
                  }
            }
            transition={{
              duration: 0.7,
            }}
          >
            <div className="relative">
              <motion.div
                className="absolute -top-6 -left-6 w-full h-full border-2 border-[#4ecca3] rounded-lg"
                animate={{
                  top: ["-1.5rem", "-1rem", "-1.5rem"],
                  left: ["-1.5rem", "-1rem", "-1.5rem"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <div className="relative z-10 overflow-hidden rounded-lg">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex]}
                    alt={`Image ${currentImageIndex + 1}`}
                    className="rounded-lg w-full h-auto"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.7 }}
                  />
                </AnimatePresence>
              </div>
              {/* Image indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "bg-[#4ecca3] w-8"
                        : "bg-gray-600 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
          <div className="md:w-1/2">
            <motion.span
              className="text-[#4ecca3] font-medium"
              initial={{
                opacity: 0,
              }}
              animate={
                inView
                  ? {
                      opacity: 1,
                    }
                  : {
                      opacity: 0,
                    }
              }
              transition={{
                duration: 0.7,
                delay: 0.1,
              }}
            >
              About Me
            </motion.span>
            <AnimatedText
              text="Aspiring Full-Stack Developer & Designer"
              className="text-3xl md:text-4xl font-bold mt-2 mb-6"
              once={false}
            />
            <motion.p
              className="text-gray-300 mb-6"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={
                inView
                  ? {
                      opacity: 1,
                      y: 0,
                    }
                  : {
                      opacity: 0,
                      y: 20,
                    }
              }
              transition={{
                duration: 0.7,
                delay: 0.3,
              }}
            >
              I'm a 4th year Computer Science Student at University of Santo
              Tomas. I'm a creative developer with a passion for building
              beautiful, functional, and user-friendly websites and
              applications. With expertise in both design and development, I
              bridge the gap between aesthetics and functionality.
            </motion.p>
            <motion.p
              className="text-gray-300 mb-8"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={
                inView
                  ? {
                      opacity: 1,
                      y: 0,
                    }
                  : {
                      opacity: 0,
                      y: 20,
                    }
              }
              transition={{
                duration: 0.7,
                delay: 0.4,
              }}
            >
              My approach combines technical excellence with creative
              problem-solving, resulting in digital solutions that not only work
              flawlessly but also engage and delight users.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{
                opacity: 0,
              }}
              animate={
                inView
                  ? {
                      opacity: 1,
                    }
                  : {
                      opacity: 0,
                    }
              }
              transition={{
                duration: 0.7,
                delay: 0.5,
              }}
            >
              {[
                "React",
                "TypeScript",
                "UI/UX Design",
                "Node.js",
                "Framer Motion",
                "Django",
                "Python",
                "SEO",
              ].map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-[#111] rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
