import { projects } from '@/contents/projects';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import Navbar from '../../components/Navbar';


const TropheePage =  ({ params }: { params: { id: string } }) => {
  const project = projects.find((p) => p.id === Number(params.id));

  if (!project) {
    return <div>Projet non trouvé</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100  text-black ">
      <Navbar />
      <div className="container mx-auto  py-8 h-[90vh] flex flex-col justify-center items-center">
        <div className="max-w-4xl mx-auto bg-white  rounded-lg shadow-lg overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            width={800}
            height={400}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h1 className="text-4xl font-extrabold  mb-4">{project.title}</h1>
            <p className="text-lg mb-6">{project.description}</p>
            <div className="flex flex-wrap items-center mb-6">
              <h2 className="text-2xl font-semibold mr-4">Technologies:</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-gray-200  text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {project.githubLink && (
                <Link
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-lg text-blue-500 hover:underline"
                >
                  <FaGithub className="mr-2" />
                  GitHub
                </Link>
              )}
              {project.demoLink && (
                <Link
                  href={project.demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-lg text-green-500 hover:underline"
                >
                  <FiExternalLink className="mr-2" />
                  Démo
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TropheePage;
