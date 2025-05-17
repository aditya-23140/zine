export interface Spread {
  title: string;
  content: string;
  image: string;
  backgroundImage: string;
  description: string;
  backTitle?: string;
  backContent?: string;
  hasInteractiveElement?: boolean;
  interactiveButtonText?: string;
  interactiveAction?: () => void;
}

export const spreads: Spread[] = [
  {
    title: "The Beginning",
    content: `
      <p>Welcome to the first spread of our interactive zine. This page introduces the concept and sets the tone for what's to come.</p>
      <p>Zines have a rich history as self-published, small-circulation works that allow creators to express themselves freely outside of mainstream publishing.</p>
      <p>This digital zine combines traditional zine aesthetics with modern interactive elements.</p>
    `,
    image:
      "https://images.unsplash.com/photo-1598618443855-232ee0f819f6?q=80&w=2070&auto=format&fit=crop",
    backgroundImage:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop",
    description: "An introduction to the zine concept",
    backTitle: "History of Zines",
    backContent: `
      <p>Zines emerged from science fiction fan culture in the 1930s and evolved through punk, riot grrrl, and DIY movements.</p>
      <p>The term "zine" comes from "fanzine" or "magazine" and represents independent, often handmade publications.</p>
      <p>Digital zines like this one represent the evolution of the medium into the digital age.</p>
    `,
    hasInteractiveElement: true,
    interactiveButtonText: "Learn History",
    interactiveAction: () => {
      alert(
        "Zines have been a form of independent publishing since the 1930s!"
      );
    },
  },
  {
    title: "Visual Storytelling",
    content: `
      <p>This spread explores the power of visual storytelling and how images can convey complex emotions and narratives.</p>
      <p>The combination of text and visuals creates a multi-layered experience that engages different parts of the brain.</p>
      <p>In digital zines, we can enhance this experience with animations, interactions, and sound.</p>
    `,
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop",
    backgroundImage:
      "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop",
    description: "Exploring visual storytelling techniques",
    backTitle: "Behind the Scenes",
    backContent: `
      <p>Creating compelling visual narratives requires careful consideration of composition, color, and pacing.</p>
      <p>The images in this zine were selected to create a cohesive visual language that supports the textual content.</p>
      <p>Try to notice how the background colors and patterns influence your emotional response to each spread.</p>
    `,
    hasInteractiveElement: true,
    interactiveButtonText: "Color Theory",
    interactiveAction: () => {
      alert(
        "Color theory is the study of how colors affect human perception and emotion!"
      );
    },
  },
  {
    title: "Interactive Elements",
    content: `
      <p>This spread demonstrates how interactive elements can enhance the zine experience.</p>
      <p>Unlike traditional print zines, digital zines can include animations, sounds, and user interactions.</p>
      <p>These elements create a more immersive and engaging experience for the reader.</p>
    `,
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
    backgroundImage:
      "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=2070&auto=format&fit=crop",
    description: "Demonstrating interactive capabilities",
    hasInteractiveElement: true,
    interactiveButtonText: "Try Interaction",
    interactiveAction: () => {
      const colors = ["#ff6b6b", "#48dbfb", "#1dd1a1", "#feca57", "#ff9ff3"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      // Create a temporary overlay instead of changing body background
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.inset = "0";
      overlay.style.backgroundColor = randomColor;
      overlay.style.zIndex = "100";
      overlay.style.opacity = "0.7";
      overlay.style.pointerEvents = "none";
      overlay.style.transition = "opacity 1s";

      document.body.appendChild(overlay);

      // Remove after animation
      setTimeout(() => {
        overlay.style.opacity = "0";
        setTimeout(() => {
          document.body.removeChild(overlay);
        }, 1000);
      }, 1000);
    },
  },
  {
    title: "Future of Digital Zines",
    content: `
      <p>This final spread looks at the future of digital zines and interactive storytelling.</p>
      <p>As technology evolves, so too will the ways we create and consume zines and other independent media.</p>
      <p>The democratization of publishing tools means more diverse voices can share their stories with the world.</p>
    `,
    image:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2074&auto=format&fit=crop",
    backgroundImage:
      "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop",
    description: "Looking toward future possibilities",
    backTitle: "Your Turn",
    backContent: `
      <p>Now that you've explored this interactive zine, why not create your own?</p>
      <p>Digital tools make it easier than ever to combine text, images, and interactive elements into your own unique publication.</p>
      <p>Share your voice and perspective with the world through the intimate, personal medium of zines.</p>
    `,
    hasInteractiveElement: true,
    interactiveButtonText: "Get Inspired",
    interactiveAction: () => {
      window.open("https://www.are.na/search/zines", "_blank");
    },
  },
];
