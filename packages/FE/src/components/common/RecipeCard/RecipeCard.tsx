import { memo } from "react";
import { Link } from "@tanstack/react-router";

import config from "@/config";
import { composeCdnUrl } from "@/lib/utils";

import StyledRecipeCard, { StyledRecipeCardOverlay } from "./styled";
import { RecipeCardProps } from "./types";

const RecipeCard = memo(({ id, title, thumbnailUrl }: RecipeCardProps) => {
  return (
    <StyledRecipeCard>
      <Link params={{ id: id.toString() }} to="/recipe/$id">
        <img
          src={composeCdnUrl(config.cdnUrl, thumbnailUrl)}
          width="100%"
          loading="lazy"
          style={{ objectFit: "cover", borderRadius: "var(--radius)" }}
        />
        <StyledRecipeCardOverlay>
          <p
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
          >
            {title}
          </p>
        </StyledRecipeCardOverlay>
      </Link>
    </StyledRecipeCard>
  );
});

export default RecipeCard;
