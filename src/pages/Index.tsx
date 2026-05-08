import { 
  Navbar, 
  Hero, 
  Features, 
  Boards, 
  CTA, 
  Footer, 
  ResourceImport, 
  LessonEditor, 
  CurriculumStandards, 
  ExportOptions,
  Stats,
  ResourceShowcase,
  UniqueValueProp
} from "@/components/landing";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <CTA />
        <UniqueValueProp />
        <Features />
        <ResourceShowcase />
        <ExportOptions />
        <CurriculumStandards />
        <ResourceImport />
        <LessonEditor />
        <Boards />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
