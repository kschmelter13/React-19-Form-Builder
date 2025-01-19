'use client';

import { useActionState } from 'react';

async function handleSubmit(prevState: any, formData: FormData) {
  // Move this to a separate file to use 'use server'
  //'use server';
  // Handle form submission here
  return { success: true, message: 'Form submitted successfully!' };
}

export default function GeneratedForm() {
  const [state, formAction, isPending] = useActionState(handleSubmit, null);

  return (
    <form action={formAction} style={{ width: '100%', maxWidth: '42rem', margin: '0 auto', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="text1737245064059" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Text Input</label>
        
        <input
          type="text"
          name="text1737245064059"
          id="text1737245064059"
          placeholder="Enter text..."
          
          style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem', fontSize: '1rem', transition: 'border-color 0.2s' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="email1737245064523" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Email Input</label>
        
        <input
          type="email"
          name="email1737245064523"
          id="email1737245064523"
          placeholder="Enter email..."
          
          style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem', fontSize: '1rem', transition: 'border-color 0.2s' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="password1737245065135" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Password Input</label>
        
        <input
          type="password"
          name="password1737245065135"
          id="password1737245065135"
          placeholder="Enter password..."
          
          style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem', fontSize: '1rem', transition: 'border-color 0.2s' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="text1737245072647" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Text Input</label>
        
        <input
          type="text"
          name="text1737245072647"
          id="text1737245072647"
          placeholder="Enter text..."
          
          style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem', fontSize: '1rem', transition: 'border-color 0.2s' }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <button
          type="submit"
          disabled={isPending}
          style={{ width: '100%', maxWidth: '200px', margin: '0 auto', padding: '0.75rem 1.5rem', color: 'white', backgroundColor: isPending ? '#666' : '#000', borderRadius: '0.375rem', cursor: isPending ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s' }}
        >
          {isPending ? 'Submitting...' : 'Submit'}
        </button>
      </div>

      {state?.message && (
        <p style={{ textAlign: 'center', marginTop: '1rem', color: state.success ? '#059669' : '#dc2626' }}>
          {state.message}
        </p>
      )}
    </form>
  );
}