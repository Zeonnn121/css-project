import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export default function Feedback() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    difficulty: 'moderate',
    theoryClear: 3,
    simulationClear: 3,
    uiUsable: 3,
    learned: '',
    improve: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store locally
    localStorage.setItem('xss-lab-feedback', JSON.stringify(formData));
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold text-white">Lab Feedback</h1>

      {submitted && (
        <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 flex gap-3 animate-slide-down">
          <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
          <div>
            <h3 className="font-bold text-green-400">Feedback Submitted</h3>
            <p className="text-sm text-green-300">Thank you for your feedback! It's stored locally.</p>
          </div>
        </div>
      )}

      <div className="lab-card">
        <p className="text-gray-300 mb-4">
          Your feedback helps us improve this educational lab. All data is stored locally on your device only.
          No external data collection occurs.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Difficulty */}
          <div>
            <label className="block text-gray-200 font-bold mb-3">
              How would you rate the lab difficulty?
            </label>
            <div className="space-y-2">
              {['easy', 'moderate', 'difficult'].map(level => (
                <label key={level} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="difficulty"
                    value={level}
                    checked={formData.difficulty === level}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-300 capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Theory Clarity */}
          <div>
            <label className="block text-gray-200 font-bold mb-3">
              How clear was the theory section?
              <span className="text-security-blue ml-2">{formData.theoryClear}/5</span>
            </label>
            <input
              type="range"
              name="theoryClear"
              min="1"
              max="5"
              value={formData.theoryClear}
              onChange={handleChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Not Clear</span>
              <span>Very Clear</span>
            </div>
          </div>

          {/* Simulation Clarity */}
          <div>
            <label className="block text-gray-200 font-bold mb-3">
              How clear was the XSS simulation?
              <span className="text-security-blue ml-2">{formData.simulationClear}/5</span>
            </label>
            <input
              type="range"
              name="simulationClear"
              min="1"
              max="5"
              value={formData.simulationClear}
              onChange={handleChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Confusing</span>
              <span>Very Clear</span>
            </div>
          </div>

          {/* UI Usability */}
          <div>
            <label className="block text-gray-200 font-bold mb-3">
              How usable is the UI?
              <span className="text-security-blue ml-2">{formData.uiUsable}/5</span>
            </label>
            <input
              type="range"
              name="uiUsable"
              min="1"
              max="5"
              value={formData.uiUsable}
              onChange={handleChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Hard to Use</span>
              <span>Very Usable</span>
            </div>
          </div>

          {/* What Learned */}
          <div>
            <label className="block text-gray-200 font-bold mb-2">
              What did you learn from this lab?
            </label>
            <textarea
              name="learned"
              value={formData.learned}
              onChange={handleChange}
              className="w-full bg-dark-700 text-gray-200 rounded px-3 py-2 border border-dark-600 focus:border-security-blue outline-none"
              rows={4}
              placeholder="Describe key concepts you learned..."
            />
          </div>

          {/* Improvements */}
          <div>
            <label className="block text-gray-200 font-bold mb-2">
              What could we improve?
            </label>
            <textarea
              name="improve"
              value={formData.improve}
              onChange={handleChange}
              className="w-full bg-dark-700 text-gray-200 rounded px-3 py-2 border border-dark-600 focus:border-security-blue outline-none"
              rows={4}
              placeholder="Suggestions for improvement..."
            />
          </div>

          <button
            type="submit"
            className="lab-btn-primary w-full"
          >
            Submit Feedback
          </button>
        </form>
      </div>

      {/* Info */}
      <div className="lab-card">
        <h3 className="font-bold mb-3">Privacy Notice</h3>
        <ul className="text-sm text-gray-300 space-y-2">
          <li>✓ Feedback is stored locally on your device only</li>
          <li>✓ No data is sent to external servers</li>
          <li>✓ You can delete this data anytime</li>
          <li>✓ No personal information is collected</li>
        </ul>
      </div>
    </div>
  );
}
