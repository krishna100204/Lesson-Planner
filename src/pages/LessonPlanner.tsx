import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { generateLessonPlan } from '@/lib/gemini';
import { generatePDF } from '@/lib/pdf';
import { saveLessonPlan, getLessonPlans } from '@/lib/storage';
import type { LessonPlan } from '@/types';
import { Loader2, FileDown, Wand2, Save, GraduationCap } from 'lucide-react';

export function LessonPlanner() {
  const [lessonPlan, setLessonPlan] = useState<LessonPlan>({
    topic: '',
    gradeLevel: '',
    mainConcept: '',
    subtopics: '',
    materials: '',
    objectives: '',
    outline: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedPlans, setSavedPlans] = useState<LessonPlan[]>([]);
  const [editableContent, setEditableContent] = useState('');
  const [activeTab, setActiveTab] = useState('form');

  useEffect(() => {
    setSavedPlans(getLessonPlans());
  }, []);

  useEffect(() => {
    if (lessonPlan.generatedContent) {
      setEditableContent(lessonPlan.generatedContent);
      setActiveTab('preview');
    }
  }, [lessonPlan.generatedContent]);

  const handleChange = (
    field: keyof LessonPlan,
    value: string
  ) => {
    setLessonPlan((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerate = async () => {
    if (!lessonPlan.topic || !lessonPlan.gradeLevel) {
      alert('Please enter a topic and grade level');
      return;
    }

    setIsGenerating(true);
    try {
      const generatedContent = await generateLessonPlan(
        lessonPlan.topic,
        lessonPlan.gradeLevel
      );
      
      setLessonPlan((prev) => ({
        ...prev,
        generatedContent,
      }));

      saveLessonPlan({
        ...lessonPlan,
        generatedContent,
      });

      setSavedPlans(getLessonPlans());
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate lesson plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    const updatedPlan = {
      ...lessonPlan,
      generatedContent: editableContent,
    };
    saveLessonPlan(updatedPlan);
    setSavedPlans(getLessonPlans());
    setLessonPlan(updatedPlan);
  };

  const handleDownload = async () => {
    const content = editableContent || lessonPlan.generatedContent || 
      `Topic: ${lessonPlan.topic}
Grade Level: ${lessonPlan.gradeLevel}
Main Concept: ${lessonPlan.mainConcept}
Subtopics: ${lessonPlan.subtopics}
Materials: ${lessonPlan.materials}
Objectives: ${lessonPlan.objectives}
Outline: ${lessonPlan.outline}`;

    const success = await generatePDF(content, `${lessonPlan.topic}-lesson-plan.pdf`);
    if (!success) {
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 space-y-8">
        <div className="flex justify-between items-center border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Lesson Planner</h1>
              <p className="text-sm text-muted-foreground">Create and manage your lesson plans with AI assistance</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-card text-card-foreground shadow-lg">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                  <h2 className="text-2xl font-semibold">Create Lesson Plan</h2>
                  <TabsList className="grid w-[400px] grid-cols-2">
                    <TabsTrigger value="form" className="text-sm">Plan Details</TabsTrigger>
                    <TabsTrigger value="preview" className="text-sm">Preview & Edit</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="form" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="topic">Topic</Label>
                      <Input
                        id="topic"
                        value={lessonPlan.topic}
                        onChange={(e) => handleChange('topic', e.target.value)}
                        placeholder="Enter lesson topic"
                        className="bg-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gradeLevel">Grade Level</Label>
                      <Select
                        value={lessonPlan.gradeLevel}
                        onValueChange={(value) => handleChange('gradeLevel', value)}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select grade level" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(12)].map((_, i) => (
                            <SelectItem key={i + 1} value={`Grade ${i + 1}`}>
                              Grade {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mainConcept">Main Concept</Label>
                    <Textarea
                      id="mainConcept"
                      value={lessonPlan.mainConcept}
                      onChange={(e) => handleChange('mainConcept', e.target.value)}
                      placeholder="Enter the main concept of the lesson"
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtopics">Subtopics</Label>
                    <Textarea
                      id="subtopics"
                      value={lessonPlan.subtopics}
                      onChange={(e) => handleChange('subtopics', e.target.value)}
                      placeholder="Enter subtopics (one per line)"
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="materials">Materials Needed</Label>
                    <Textarea
                      id="materials"
                      value={lessonPlan.materials}
                      onChange={(e) => handleChange('materials', e.target.value)}
                      placeholder="List required materials"
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="objectives">Learning Objectives</Label>
                    <Textarea
                      id="objectives"
                      value={lessonPlan.objectives}
                      onChange={(e) => handleChange('objectives', e.target.value)}
                      placeholder="Enter learning objectives"
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outline">Lesson Outline</Label>
                    <Textarea
                      id="outline"
                      value={lessonPlan.outline}
                      onChange={(e) => handleChange('outline', e.target.value)}
                      placeholder="Enter detailed lesson outline"
                      className="min-h-[200px] bg-background"
                    />
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-5 w-5" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="preview" className="space-y-6">
                  {(editableContent || lessonPlan.generatedContent) ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="editContent">Edit Generated Content</Label>
                        <Textarea
                          id="editContent"
                          value={editableContent}
                          onChange={(e) => setEditableContent(e.target.value)}
                          className="min-h-[500px] font-mono text-sm bg-background"
                        />
                      </div>
                      <div className="flex gap-4">
                        <Button onClick={handleSave} className="flex-1" size="lg">
                          <Save className="mr-2 h-5 w-5" />
                          Save Changes
                        </Button>
                        <Button onClick={handleDownload} variant="outline" className="flex-1" size="lg">
                          <FileDown className="mr-2 h-5 w-5" />
                          Download PDF
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No Content Generated Yet</p>
                      <p className="text-sm">Generate a lesson plan to preview and edit the content here.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <Card className="p-6 bg-card text-card-foreground h-fit shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 pb-4 border-b border-border">Saved Lesson Plans</h2>
            {savedPlans.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {savedPlans.map((plan) => (
                  <AccordionItem key={plan.id} value={plan.id?.toString() || ''}>
                    <AccordionTrigger className="text-left hover:no-underline hover:bg-accent/50 px-4 -mx-4">
                      <div>
                        <p className="font-medium">{plan.topic}</p>
                        <p className="text-sm text-muted-foreground">{plan.gradeLevel}</p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">Main Concept</h4>
                          <p className="mt-1">{plan.mainConcept}</p>
                        </div>
                        {plan.generatedContent && (
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground">Generated Content</h4>
                            <p className="mt-1 text-sm whitespace-pre-line line-clamp-3">
                              {plan.generatedContent}
                            </p>
                          </div>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setLessonPlan(plan);
                            setEditableContent(plan.generatedContent || '');
                            setActiveTab('preview');
                          }}
                          className="w-full"
                        >
                          Load Plan
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Save className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No Saved Plans</p>
                <p className="text-sm">Your saved lesson plans will appear here.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}