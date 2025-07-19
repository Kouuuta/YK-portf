import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

const projectsData = [
  {
    id: 1,
    title: "E-commerce Platform",
    description:
      "A modern e-commerce platform with dynamic product filtering and seamless checkout experience.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop&sat=-100",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=1200&fit=crop&sat=-100",
    ],
    tags: ["React", "Node.js", "MongoDB"],
    subtitle: ["Next-gen", "commerce is", "here to", "revolutionize."],
  },
  {
    id: 2,
    title: "Portfolio Website",
    description:
      "A creative portfolio website with interactive elements and smooth animations.",
    images: [
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=1200&fit=crop&sat=-100",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop&sat=-100",
    ],
    tags: ["React", "Framer Motion", "Tailwind CSS"],
    subtitle: ["Design is", "the silent", "ambassador of", "your brand."],
  },
  {
    id: 3,
    title: "Task Management App",
    description:
      "A productivity app that helps users manage tasks with intuitive UI and real-time updates.",
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=1200&fit=crop&sat=-100",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop&sat=-100",
    ],
    tags: ["React", "Firebase", "TypeScript"],
    subtitle: [
      "Productivity",
      "meets elegant",
      "simplicity in",
      "perfect harmony.",
    ],
  },
  {
    id: 4,
    title: "Social Media Dashboard",
    description:
      "A comprehensive dashboard for social media analytics with interactive charts.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop&sat=-100",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=1200&fit=crop&sat=-100",
    ],
    tags: ["React", "D3.js", "Express"],
    subtitle: ["Data tells", "stories that", "transform", "businesses."],
  },
];

const ShaderSlider = ({ currentIndex, images, onTransitionComplete }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const materialRef = useRef(null);
  const texturesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(
      mountRef.current.offsetWidth,
      mountRef.current.offsetHeight
    );
    mountRef.current.appendChild(renderer.domElement);

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      uniform sampler2D texture1;
      uniform sampler2D texture2;
      uniform sampler2D disp;
      uniform float dispPower;
      uniform float intensity;

      void main() {
        vec2 uv = vUv;
        vec4 disp = texture2D(disp, uv);
        vec2 dispVec = vec2(disp.x, disp.y);
        
        vec2 distPos1 = uv + (dispVec * intensity * dispPower);
        vec2 distPos2 = uv + (dispVec * -(intensity * (1.0 - dispPower)));
        
        vec4 _texture1 = texture2D(texture1, distPos1);
        vec4 _texture2 = texture2D(texture2, distPos2);
        
        gl_FragColor = mix(_texture1, _texture2, dispPower);
      }
    `;

    // Load textures
    const loader = new THREE.TextureLoader();
    const dispTexture = loader.load(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
    );

    const material = new THREE.ShaderMaterial({
      uniforms: {
        dispPower: { value: 0.0 },
        intensity: { value: 0.5 },
        texture1: { value: null },
        texture2: { value: null },
        disp: { value: dispTexture },
      },
      vertexShader,
      fragmentShader,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    materialRef.current = material;

    // Load project images
    images.forEach((imageUrl, index) => {
      loader.load(imageUrl, (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        texturesRef.current[index] = texture;

        if (index === 0) {
          material.uniforms.texture1.value = texture;
        } else if (index === 1) {
          material.uniforms.texture2.value = texture;
        }

        renderer.render(scene, camera);
      });
    });

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!materialRef.current || !texturesRef.current.length) return;

    const material = materialRef.current;
    const currentTexture = texturesRef.current[0];
    const nextTexture = texturesRef.current[1];

    if (currentTexture && nextTexture) {
      material.uniforms.texture1.value = currentTexture;
      material.uniforms.texture2.value = nextTexture;

      // Animate transition
      const startTime = Date.now();
      const duration = 2000;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        material.uniforms.dispPower.value = progress;
        rendererRef.current?.render(
          sceneRef.current,
          new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
        );

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          material.uniforms.dispPower.value = 0;
          onTransitionComplete?.();
        }
      };

      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentIndex]);

  return <div ref={mountRef} className="absolute inset-0" />;
};

const Projects = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showScroll, setShowScroll] = useState(true);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setShowScroll(false);
    setCurrentIndex((prev) => (prev + 1) % projectsData.length);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(
      (prev) => (prev - 1 + projectsData.length) % projectsData.length
    );
  };

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
  };

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) > 50) {
        // Add threshold for more control
        if (e.deltaY > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    };

    const sliderElement = document.getElementById("projects");
    if (sliderElement) {
      sliderElement.addEventListener("wheel", handleWheel, { passive: false });
      return () => sliderElement.removeEventListener("wheel", handleWheel);
    }
  }, [isTransitioning]);

  const current = projectsData[currentIndex];

  return (
    <section
      className="relative py-24 w-full bg-black overflow-hidden"
      id="projects"
    >
      <div className="container mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            className="text-[#4ecca3] font-medium"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
          >
            My Work
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mt-2 mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.7 }}
          >
            Featured Projects
          </motion.h2>
          <motion.p
            className="text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Explore some of my recent projects. Scroll to navigate through the
            collection.
          </motion.p>
        </div>

        {/* Main Slider */}
        <div className="relative h-[600px] w-full">
          <ShaderSlider
            currentIndex={currentIndex}
            images={current.images}
            onTransitionComplete={handleTransitionComplete}
          />

          {/* Slide Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Project Images */}
              <div className="flex items-center justify-center space-x-8">
                {current.images.map((image, index) => (
                  <motion.div
                    key={index}
                    className={`relative ${index === 0 ? "-mt-6" : "mt-6"}`}
                    initial={{ y: index === 0 ? -150 : 150, scaleY: 1.5 }}
                    animate={{ y: 0, scaleY: 1 }}
                    exit={{ y: index === 0 ? -185 : 185, scaleY: 1.5 }}
                    transition={{
                      duration: 1.5,
                      ease: [0.19, 1, 0.22, 1],
                      delay: index * 0.075,
                    }}
                  >
                    <img
                      src={image}
                      alt={current.title}
                      className="w-64 h-80 md:w-80 md:h-96 object-cover min-w-48 grayscale"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Project Text */}
          <div className="absolute bottom-12 left-8 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="text-white text-4xl md:text-6xl font-bold uppercase leading-tight"
              >
                {current.subtitle.map((line, index) => (
                  <div key={index} className="overflow-hidden">
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-100%" }}
                      transition={{
                        duration: 2,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        delay: index * 0.1,
                      }}
                    >
                      {line}
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex space-x-2">
              {projectsData.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    currentIndex === index ? "bg-[#4ecca3]" : "bg-gray-600"
                  }`}
                  onClick={() => !isTransitioning && setCurrentIndex(index)}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
          </div>

          {/* Vertical Text */}
          <div className="absolute bottom-8 right-8 w-60 flex items-center z-10">
            <span className="text-white uppercase text-lg transform rotate-[90deg] translate-y-60 origin-bottom-left whitespace-nowrap">
              {current.title}
              <br />
              {current.tags.join(" × ")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
