import FlowArt, { FlowSection } from '@/components/ui/story-scroll';

export default function FlowArtDefaultDemo() {
  return (
    <FlowArt aria-label="ModelMarket Scroll Demo">
      <FlowSection aria-label="AI Micro-payment Made Simple" style={{ backgroundColor: '#fd5200', color: '#fff' }}>
        {/* Place your content for the first section here */}
        <h1>AI Micro-payment Made Simple</h1>
      </FlowSection>
      <FlowSection aria-label="Invisible Blockchain" style={{ backgroundColor: '#000', color: '#fff' }}>
        {/* Place your content for the second section here */}
        <h1>Invisible Blockchain</h1>
      </FlowSection>
      <FlowSection aria-label="Available Models" style={{ backgroundColor: '#F5F0E8', color: '#000' }}>
        {/* Place your content for the third section here */}
        <h1>Available Models</h1>
      </FlowSection>
      <FlowSection aria-label="Live Integration Demo" style={{ backgroundColor: '#1A3DE8', color: '#fff' }}>
        {/* Place your content for the fourth section here */}
        <h1>Live Integration Demo</h1>
        {/* Footer can be placed here or as a separate component */}
        <footer className="mt-12">Footer Content</footer>
      </FlowSection>
    </FlowArt>
  );
}
