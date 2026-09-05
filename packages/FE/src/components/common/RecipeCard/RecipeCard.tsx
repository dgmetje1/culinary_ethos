import { memo } from "react";
import { Link } from "@tanstack/react-router";

import config from "@/config";
import { composeCdnUrl } from "@/lib/utils";

import StyledRecipeCard, { StyledRecipeImageWrapper } from "./styled";
import { RecipeCardProps } from "./types";

const RecipeCard = memo(
  ({ id, title, thumbnailUrl, time, author, categories }: RecipeCardProps) => {
    const categoryName = categories?.[0]?.name;
    const minutes = time ? Math.floor(time / 60) : null;

    return (
      <StyledRecipeCard>
        <Link params={{ id: id.toString() }} to="/recipe/$id">
          <StyledRecipeImageWrapper>
            <img
              src={composeCdnUrl(config.cdnUrl, thumbnailUrl)}
              alt={title}
              className="w-full object-cover rounded transition-all duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </StyledRecipeImageWrapper>
          {categoryName && minutes && (
            <span
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: 12,
                fontWeight: 600,
                lineHeight: 1,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "hsl(var(--muted-foreground))",
              }}
            >
              {categoryName} &bull; {minutes} Min
            </span>
          )}
          <h3
            style={{
              fontFamily: "Noto Serif, serif",
              fontSize: 24,
              fontWeight: 500,
              lineHeight: 1.3,
              color: "hsl(var(--primary))",
              marginTop: 8,
              marginBottom: 4,
            }}
            className="group-hover:text-secondary transition-colors"
          >
            {title}
          </h3>
          {author && (
            <p
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: 16,
                lineHeight: 1.6,
                color: "hsl(var(--muted-foreground))",
              }}
            >
              Por {author}
            </p>
          )}
        </Link>
      </StyledRecipeCard>
    );
  },
);

export default RecipeCard;
