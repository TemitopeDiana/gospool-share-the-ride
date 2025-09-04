import React from 'react';
import { supabase } from '@/integrations/supabase/client';

export const DebugForm = () => {
  const testSimpleInsert = async () => {
    try {
      console.log("Testing simple insert...");
      const { data, error } = await supabase
        .from('volunteer_applications')
        .insert({
          applicant_name: 'Test User',
          email: 'test@example.com',
          phone: '1234567890',
          preferred_areas: 'Testing',
          applied_date: new Date().toISOString(),
          resume_url: '',
          status: 'pending',
        })
        .select();
      
      if (error) {
        console.error("Error:", error);
        alert(`Error: ${error.message}`);
      } else {
        console.log("Success:", data);
        alert('Insert successful!');
      }
    } catch (err) {
      console.error("Exception:", err);
      alert(`Exception: ${err.message}`);
    }
  };

  const testStorageBucket = async () => {
    try {
      console.log("Testing storage bucket...");
      // Check if bucket exists
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('volunteer-resumes');
      
      if (bucketError) {
        console.error("Bucket error:", bucketError);
        alert(`Bucket error: ${bucketError.message}`);
        return;
      }
      
      console.log("Bucket data:", bucketData);
      alert(`Bucket exists: ${JSON.stringify(bucketData)}`);
      
    } catch (err) {
      console.error("Exception:", err);
      alert(`Exception: ${err.message}`);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug Form</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Test Database Insert</h2>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={testSimpleInsert}
          >
            Test Simple Insert
          </button>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Test Storage Bucket</h2>
          <button 
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={testStorageBucket}
          >
            Test Storage Bucket
          </button>
        </div>
      </div>
    </div>
  );
};
