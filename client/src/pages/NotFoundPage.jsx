import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 text-center">
      <Container>
        <div className="max-w-md mx-auto space-y-6">
          <span className="text-8xl font-display font-extrabold text-[var(--color-accent)] font-mono block">
            404
          </span>
          <h1 className="text-3xl font-display uppercase tracking-wider text-[var(--color-text)]">
            Page Off-Course
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            The page you are looking for has been moved, removed, or never existed in our garage.
          </p>
          <Link to={ROUTES.HOME}>
            <Button variant="primary" icon={ArrowLeft} size="lg">
              Return To Showroom
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
