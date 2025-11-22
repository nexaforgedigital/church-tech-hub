import { Smartphone } from 'lucide-react';

export default function LandscapePrompt() {
  return (
    <div className="rotate-message">
      <Smartphone size={80} className="mb-6 animate-bounce" />
      <h2 className="text-3xl font-bold mb-4">Please Rotate Your Device</h2>
      <p className="text-xl mb-6 opacity-90">
        For the best presentation experience, please turn your device to landscape mode
      </p>
      <div className="flex items-center justify-center gap-4 text-6xl">
        <div className="transform rotate-90">📱</div>
        <div>→</div>
        <div>📱</div>
      </div>
    </div>
  );
}