import { projects } from '@/contents/projects';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import Navbar from '../../components/Navbar';


const TropheePage = ({ params }: { params: { id: string } }) => {
  const project = projects.find((p) => p.id === Number(params.id));

  if (!project) return <div>Projet non trouvé</div>;

  const mainImage = Array.isArray(project.imageProject) ? project.imageProject[0] : <Image src={project.imageProject} alt={project.title || project.project} fill style={{ objectFit: 'cover' }} />;

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar />
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col lg:flex-row">
          {/* Left: big image */}
          <div className="lg:w-1/2 w-full h-96 lg:h-[80vh] relative">
            <Image
              src={mainImage}
              alt={project.title || project.project}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          </div>

          {/* Right: attributes and overview */}
          <div className="lg:w-1/2 w-full p-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-sm text-gray-600">Client:</div>
                <div className="text-xl font-semibold mt-2">{project.partenaires?.join(', ') || '-'}</div>
              </div>

              <div>
                <div className="text-sm text-gray-600">Year:</div>
                <div className="text-xl font-semibold mt-2">{project.year || '-'}</div>
              </div>

              <div>
                <div className="text-sm text-gray-600">Project:</div>
                <div className="text-xl font-semibold mt-2">{project.project || project.title}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              <div>
                <div className="text-sm text-gray-600">Scope:</div>
                <div className="text-xl font-semibold mt-2">{project.techniques?.slice(0, 3).join(', ') || '-'}</div>
              </div>

              <div>
                <div className="text-sm text-gray-600">&nbsp;</div>
                <div className="text-xl font-semibold mt-2">&nbsp;</div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Overview:</h3>
              <p className="text-base text-gray-800">{project.description}</p>
            </div>

            {/* Optional extra details */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-600">Materials</div>
                <div className="mt-2">{project.materials?.join(', ') || '-'}</div>
              </div>

              <div>
                <div className="text-sm text-gray-600">Techniques</div>
                <div className="mt-2">{project.techniques?.join(', ') || '-'}</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 mt-8">
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
