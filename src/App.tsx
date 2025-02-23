import { useState, useEffect, useCallback } from 'react';

import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FormBuilder } from '@/components/FormBuilder';
import { FormRenderer } from '@/components/FormRenderer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/Navbar';

import { getForm } from '@/lib/store';
import { Form } from '@/lib/types';

const App = () => {
  const [form, setForm] = useState<Form | null>(null);
  const [activeTab, setActiveTab] = useState('builder');

  const loadForm = useCallback(async () => {
    const formData = await getForm();
    setForm(formData);
  }, []);

  useEffect(() => {
    loadForm();
  }, [loadForm]);

  const handleTabChange = async (value: string) => {
    setActiveTab(value);
    if (value === 'preview') {
      await loadForm();
    }
  };

  return (
    <TooltipProvider>
      <Sonner visibleToasts={1} richColors />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="container mx-auto p-4 flex-1">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="builder">Form Builder</TabsTrigger>
              <TabsTrigger value="preview">Form Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="builder">
              <FormBuilder />
            </TabsContent>
            <TabsContent value="preview">
              {form && (
                <FormRenderer
                  form={form}
                  onSubmit={() => {
                    console.log('Form submitted');
                    setActiveTab('builder');
                  }}
                />
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default App;
