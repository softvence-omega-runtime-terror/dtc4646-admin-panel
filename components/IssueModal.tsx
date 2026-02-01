import React from 'react';
import { X } from 'lucide-react';

interface Issue {
  type: string;
  severity: string;
}

interface IssueItem {
  url: string;
  issues: Issue[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  issueType: 'image' | 'content' | 'keyword';
  issueData: IssueItem;
}

const IssueModal: React.FC<ModalProps> = ({ isOpen, onClose, issueType, issueData }) => {
  if (!isOpen) return null;

  const getModalContent = () => {
    switch (issueType) {
      case 'image':
        return {
          title: 'About the Image issue',
          description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.',
          solutions: [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'Nullam accumsan augue non imperdiet ultrices.'
          ],
          solutionTitle: 'Better Solution',
          solutionDescription: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.',
          solutionPoints: [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'Nullam accumsan augue non imperdiet ultrices.'
          ]
        };
      case 'content':
        return {
          title: 'Content issue',
          description: 'Title: It is a long established fact that a reader will be distracted by the readable content.',
          solutions: [
            'Description of a page when looking at its layout.',
            'The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using "Content here, content here", making it look like readable English.',
            'Many desktop publishing packages and web page'
          ],
          solutionTitle: 'Better Solution',
          solutionDescription: 'Title: It is a long established fact that a reader will be distracted by the readable content.',
          solutionPoints: [
            'Description of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using "Content here, content here", making it look like readable English.',
            'Many desktop publishing packages and web page'
          ]
        };
      case 'keyword':
        return {
          title: 'Keyword issue',
          description: 'Keyword optimization is crucial for SEO success. Proper keyword usage helps search engines understand your content.',
          solutions: [
            'Use keywords naturally in content',
            'Optimize meta descriptions',
            'Include keywords in headings'
          ],
          solutionTitle: 'Better Solution',
          solutionDescription: 'Implement strategic keyword placement and optimization techniques.',
          solutionPoints: [
            'Research and use relevant keywords',
            'Maintain proper keyword density',
            'Use long-tail keywords effectively'
          ]
        };
      default:
        return null;
    }
  };

  const content = getModalContent();
  if (!content) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Issue Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Issue Description */}
            <div className="bg-red-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-bold text-[#DC091E]">{content.title}</h3>
              </div>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                {content.description}
              </p>

              {/* Issue URL */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Affected URL:</p>
                <a 
                  href={`https://${issueData.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline break-all"
                >
                  {issueData.url}
                </a>
              </div>

              {/* Current Issues */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">Current Issues:</h4>
                <div className="flex flex-wrap gap-2">
                  {issueData.issues?.filter(issue => issue.severity !== 'solution')?.map((issue, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${
                        issue.severity === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : issue.severity === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {issue.type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description Points */}
              <ul className="space-y-2">
                {content.solutions.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span className="text-gray-700 text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Side - Better Solution */}
            <div className="bg-[#00FF7F] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <h3 className="text-lg font-bold text-[#0D1117]">{content.solutionTitle}</h3>
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                  AI Suggest
                </span>
              </div>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                {content.solutionDescription}
              </p>

              {/* Solution Points */}
              <ul className="space-y-2 mb-4">
                {content.solutionPoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-gray-700 text-sm">{point}</span>
                  </li>
                ))}
              </ul>

              {/* Keywords (for keyword issue type) */}
              {issueType === 'keyword' && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-800 mb-2">Suggested Keywords:</h4>
                  <div className="flex flex-wrap gap-2">
                    {['bestkeyword1', 'newbestkeyword1', 'keys', 'thereeekeywords', 'designs', 'four'].map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default IssueModal;