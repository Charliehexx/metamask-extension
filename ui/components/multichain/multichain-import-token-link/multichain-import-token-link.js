import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Box from '../../ui/box/box';
import { ButtonLink } from '../../component-library';
// TODO: Replace ICON_NAMES with IconName when ButtonBase/Buttons have been updated
import { ICON_NAMES } from '../../component-library/icon/deprecated';
import {
  AlignItems,
  DISPLAY,
  Size,
} from '../../../helpers/constants/design-system';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { IMPORT_TOKEN_ROUTE } from '../../../helpers/constants/routes';
import { detectNewTokens } from '../../../store/actions';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import {
  MetaMetricsEventCategory,
  MetaMetricsEventName,
} from '../../../../shared/constants/metametrics';
import {
  getIsTokenDetectionSupported,
  getIsTokenDetectionInactiveOnMainnet,
} from '../../../selectors';

export const MultichainImportTokenLink = ({ className, ...props }) => {
  const trackEvent = useContext(MetaMetricsContext);
  const t = useI18nContext();
  const history = useHistory();

  const isTokenDetectionSupported = useSelector(getIsTokenDetectionSupported);
  const isTokenDetectionInactiveOnMainnet = useSelector(
    getIsTokenDetectionInactiveOnMainnet,
  );

  const isTokenDetectionAvailable =
    isTokenDetectionSupported ||
    isTokenDetectionInactiveOnMainnet ||
    Boolean(process.env.IN_TEST);
  return (
    <Box
      className={classnames('multichain-import-token-link', className)}
      {...props}
    >
      <Box display={DISPLAY.FLEX} alignItems={AlignItems.center}>
        <ButtonLink
          size={Size.MD}
          data-testid="import-token-button"
          startIconName={ICON_NAMES.ADD}
          onClick={() => {
            history.push(IMPORT_TOKEN_ROUTE);
            trackEvent({
              event: MetaMetricsEventName.TokenImportButtonClicked,
              category: MetaMetricsEventCategory.Navigation,
              properties: {
                location: 'Home',
              },
            });
          }}
        >
          {isTokenDetectionAvailable
            ? t('importTokensCamelCase')
            : t('importTokensCamelCase').charAt(0).toUpperCase() +
              t('importTokensCamelCase').slice(1)}
        </ButtonLink>
      </Box>
      <Box
        display={DISPLAY.FLEX}
        alignItems={AlignItems.center}
        paddingBottom={4}
        paddingTop={4}
      >
        <ButtonLink
          startIconName={ICON_NAMES.REFRESH}
          data-testid="refresh-list-button"
          onClick={() => detectNewTokens()}
        >
          {t('refreshList')}
        </ButtonLink>
      </Box>
    </Box>
  );
};

MultichainImportTokenLink.propTypes = {
  /**
   * An additional className to apply to the TokenList.
   */
  className: PropTypes.string,
};
