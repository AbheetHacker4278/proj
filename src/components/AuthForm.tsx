import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AuthForm = () => {
  return (
    <div className="flex flex-col md:flex-row ">
      {/* Image Section */}
      <div className="mb-6 md:mb-0 md:mr-8">
        <img
          className="w-full max-w-md rounded-lg shadow-lg"
          src="https://cdn.pixabay.com/photo/2023/12/23/16/12/dark-8465890_640.jpg"
          alt="Welcome Image"
        />
      </div>

      {/* Authentication Form Section */}
      <div>
        <Card className="w-full max-w-md animate-fadeIn bg-gray-800 text-white shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-purple-400">
              🤫 Welcome To Whisper Room
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#4F46E5', // A more vibrant indigo shade
                      brandAccent: '#4338CA', // A complementary accent indigo
                      inputBorder: '#E5E7EB', // Subtle border color for inputs
                      inputBackground: '#F9FAFB', // Light background for input fields
                    },
                  },
                },
              }}
              providers={[]}
              redirectTo={window.location.origin}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
