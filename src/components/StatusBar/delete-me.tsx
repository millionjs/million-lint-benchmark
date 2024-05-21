import { Core } from "@faire/design-tokens";
import { trackSearchNarrowAutocompleteDropdownClick } from "@faire/web-api/events/search/click/narrowAutocompleteDropdown";
import { trackSearchNarrowAutocompleteDropdownView } from "@faire/web-api/events/search/view/narrowAutocompleteDropdown";
import { useStrictLocalization } from "@faire/web/common/localization";
import { Opacity } from "@faire/web/slate/Color";
import { Flex } from "@faire/web/slate/Layout";
import { getSpacing } from "@faire/web/slate/spacing";
import { Typography } from "@faire/web/slate/Typography";
import { Link } from "@faire/web/ui/LinkAnchor";
import * as React from "react";
import styled from "styled-components";

import {
  IFlattenedSearchProductsRequest,
  ISuggestionEntry,
} from "@retailer/components/TopSearch/ResultDropdown/__internal__/Interfaces";
import { InfoWrapper } from "@retailer/components/TopSearch/ResultDropdown/__internal__/Styled";
import { RESULT_DROPDOWN_ITEM_DATA_TEST_ID } from "@retailer/components/TopSearch/ResultDropdown/consts";
import { ResultDropdownDeleteButton } from "@retailer/components/TopSearch/ResultDropdown/ResultDropdownDeleteButton";
import StringHighlight from "@retailer/components/TopSearch/ResultDropdown/StringHighlight";
import { EAEAEA_PIXEL } from "@retailer/consts/EAEAEA_PIXEL";

const SEARCH_ITEM_LINK_HEIGHT = getSpacing("7x");
const SEARCH_ITEM_LINK_HEIGHT_SMALL = getSpacing("6x");
const SEARCH_ITEM_LINK_PADDING_LEFT = getSpacing("2x");
const IMAGE_SEARCH_TERM_WRAPPER_PADDING_RIGHT = getSpacing("2x");
const STYLED_DELETE_BUTTON_PADDING_RIGHT = getSpacing("3x");
const CATEGORY_FILTER_PREFIX: string = "category:";
const TRACKER_DELIMITER: string = "|";

interface IProps {
  suggestion: ISuggestionEntry;
  onHover: () => void;
  onClick: () => void;
  // image is either the source string of an image OR an SVG icon element from Faire Foundations https://web-docs.faire.team/icons/foundation
  image?: string | JSX.Element;
  // To show 'x', pass onDelete
  onDelete?: () => void;
  // To show loading spinner in place of 'x', pass isDeleting as true
  isDeleting?: boolean;
  reverseHighlightText?: string;
  selected?: boolean;
  shouldEnableSuggestionsImpressionAllocationV2?: boolean;
}
export const ResultDropdownImageSearchItem: React.FC<IProps> = ({
  suggestion,
  onDelete,
  isDeleting = false,
  onHover,
  onClick,
  image = EAEAEA_PIXEL,
  reverseHighlightText,
  selected,
  shouldEnableSuggestionsImpressionAllocationV2,
}) => {
  const { strictLocalize } = useStrictLocalization();
  const searchData: IFlattenedSearchProductsRequest =
    suggestion.searchData as IFlattenedSearchProductsRequest;
  const hasValidSuggestionSubtitle: boolean =
    searchData.category_display_name !== undefined &&
    searchData.category_key !== undefined;
  const shouldTrackAutocompleteSuggestion: boolean =
    hasValidSuggestionSubtitle &&
    suggestion.requestID !== undefined &&
    reverseHighlightText !== undefined;

  React.useEffect(() => {
    if (shouldTrackAutocompleteSuggestion) {
      trackSearchNarrowAutocompleteDropdownView(
        reverseHighlightText + TRACKER_DELIMITER + suggestion.label,
        searchData.category_key!.replace(CATEGORY_FILTER_PREFIX, "").trim(),
        suggestion.requestID!,
      );
    }
  }, [
    reverseHighlightText,
    searchData.category_key,
    shouldTrackAutocompleteSuggestion,
    suggestion.label,
    suggestion.requestID,
  ]);

  /**
   * Callback function that performs click-tracking for autcomplete
   * as well as the provided onClick() prop
   */
  const onClickCallback = () => {
    if (shouldTrackAutocompleteSuggestion) {
      trackSearchNarrowAutocompleteDropdownClick(
        reverseHighlightText + TRACKER_DELIMITER + suggestion.label,
        searchData.category_key!.replace(CATEGORY_FILTER_PREFIX, "").trim(),
        suggestion.requestID!,
      );
    }
    onClick();
  };

  return (
    <Wrapper data-test-id="search-recommendation-full-width-item">
      <SearchItemLink
        onClick={isDeleting ? undefined : onClickCallback}
        onMouseEnter={onHover}
        to={suggestion.url}
        tabIndex={-1}
        $selected={selected}
        $height={
          shouldEnableSuggestionsImpressionAllocationV2
            ? SEARCH_ITEM_LINK_HEIGHT_SMALL
            : SEARCH_ITEM_LINK_HEIGHT
        }
      >
        <ImageSearchTermWrapper>
          {typeof image === "string" ? (
            <StyledImage
              src={image}
              data-test-id={`result-dropdown-image-search-item-image-${suggestion.label}`}
            />
          ) : (
            <SVGIconWrapper>{image}</SVGIconWrapper>
          )}
          <InfoWrapper>
            <Typography data-test-id={RESULT_DROPDOWN_ITEM_DATA_TEST_ID}>
              {reverseHighlightText !== undefined &&
              reverseHighlightText !== "" ? (
                <StringHighlight
                  message={suggestion.label}
                  highlight={reverseHighlightText}
                  reverseHighlight
                />
              ) : (
                suggestion.label
              )}
            </Typography>
            <MaybeSuggestionSubtitle
              hasValidSuggestionSubtitle={hasValidSuggestionSubtitle}
              searchData={searchData}
            />
          </InfoWrapper>
        </ImageSearchTermWrapper>
        {onDelete ? (
          <StyledDeleteButton
            onDelete={onDelete}
            isDeleting={isDeleting}
            ariaLabel={strictLocalize(
              {
                defaultMessage:
                  'Delete "{labelFullyTranslatedSentence}" search query',
                description: {
                  text: "Prompt to remove a saved search term from history",
                },
              },
              { labelFullyTranslatedSentence: suggestion.label },
            )}
          />
        ) : null}
      </SearchItemLink>
    </Wrapper>
  );
};

const MaybeSuggestionSubtitle = ({
  hasValidSuggestionSubtitle,
  searchData,
}: {
  hasValidSuggestionSubtitle: boolean;
  searchData: IFlattenedSearchProductsRequest;
}) => {
  if (hasValidSuggestionSubtitle) {
    // Translations of category_display_name are handled in the BE
    return (
      <SubtitleWrapper>{searchData.category_display_name}</SubtitleWrapper>
    );
  }

  return null;
};

const StyledDeleteButton = styled(ResultDropdownDeleteButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding-right: ${STYLED_DELETE_BUTTON_PADDING_RIGHT};
`;

const SearchItemLink = styled(Link)<{
  $selected?: boolean;
  $height?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: ${({ $height }) => $height};
  padding-left: ${SEARCH_ITEM_LINK_PADDING_LEFT};

  background-color: ${({ $selected }) =>
    $selected ? Core.surface.subdued + Opacity.O_50 : undefined};
`;

const Wrapper = styled.li`
  display: flex;
  align-items: center;
  position: relative;
`;

const StyledImage = styled.img`
  height: 40px;
  width: 40px;
  position: relative;
  border-radius: 50%;
`;

const ImageSearchTermWrapper = styled(Flex).attrs({
  justify: "flex-start",
  align: "center",
})`
  overflow: hidden;
  padding-right: ${IMAGE_SEARCH_TERM_WRAPPER_PADDING_RIGHT};
`;

const SVGIconWrapper = styled(Flex).attrs({
  justify: "center",
  align: "center",
})`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: ${Core.surface.subdued};
`;

const SubtitleWrapper = styled(Typography).attrs({
  truncate: true,
  color: Core.text.subdued,
})`
  width: 100%;
`;
