import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SignIn } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { OAuthButtons } from '../components/Authentication';
import { useTranslation } from '../hooks/useTranslation';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-card-foreground">
            {t('loginPage.title')}
          </h2>
          <p className="mt-2 text-sm text-card-foreground/80">
            Sign in to your account
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="text-center">
              <h3 className="text-lg font-medium text-card-foreground">
                Welcome back
              </h3>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to access your account
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <SignIn
              path="/login"
              routing="path"
              signUpUrl="/register"
              redirectUrl={from}
              appearance={{
                elements: {
                  formButtonPrimary: "w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors",
                  card: "shadow-none border-0",
                  headerTitle: "text-2xl font-bold",
                  headerSubtitle: "text-muted-foreground",
                  formFieldInput: "w-full px-3 py-2 border border-input rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500",
                  footerActionLink: "text-primary-600 hover:text-primary-500 font-medium",
                  socialButtonsBlockButton: "w-full flex items-center justify-center gap-2 py-2 px-4 border border-input rounded-md text-sm font-medium hover:bg-gray-50 transition-colors",
                }
              }}
            />

            <OAuthButtons />

            <div className="text-center">
              <p className="text-sm text-card-foreground/80">
                {t('loginPage.noAccount')}{' '}
                <Link to="/register" className="font-medium text-primary-500 hover:text-primary-400">
                  {t('loginPage.registerLink')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;