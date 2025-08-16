<?php

/**
 * JCH Optimize - Performs several front-end optimizations for fast downloads
 *
 * @package   jchoptimize/core
 * @author    Samuel Marshall <samuel@jch-optimize.net>
 * @copyright Copyright (c) 2023 Samuel Marshall / JCH Optimize
 * @license   GNU/GPLv3, or later. See LICENSE file
 *
 *  If LICENSE file missing, see <http://www.gnu.org/licenses/>.
 */

namespace JchOptimize\Core\Uri;

use _JchOptimizeVendor\V91\GuzzleHttp\Psr7\UriNormalizer as GuzzleNormalizer;
use _JchOptimizeVendor\V91\Psr\Http\Message\UriInterface;
use JchOptimize\Core\Helper;

class UriNormalizer
{
    public static function normalize(UriInterface $uri): UriInterface
    {
        if ($uri->getScheme() == 'data') {
            return self::dataUriNormalize($uri);
        }

        return GuzzleNormalizer::normalize(
            $uri,
            GuzzleNormalizer::CAPITALIZE_PERCENT_ENCODING | GuzzleNormalizer::DECODE_UNRESERVED_CHARACTERS | GuzzleNormalizer::REMOVE_DOT_SEGMENTS | GuzzleNormalizer::REMOVE_DUPLICATE_SLASHES
        );
    }

    public static function pageCacheIdNormalize(UriInterface $uri): UriInterface
    {
        return GuzzleNormalizer::normalize(
            $uri->withPath(Helper::removeLeadingSlash($uri->getPath())),
            GuzzleNormalizer::PRESERVING_NORMALIZATIONS | GuzzleNormalizer::REMOVE_DUPLICATE_SLASHES | GuzzleNormalizer::SORT_QUERY_PARAMETERS
        );
    }

    public static function systemUriNormalize(UriInterface $uri): UriInterface
    {
        return GuzzleNormalizer::normalize(
            $uri,
            GuzzleNormalizer::CAPITALIZE_PERCENT_ENCODING | GuzzleNormalizer::DECODE_UNRESERVED_CHARACTERS | GuzzleNormalizer::CONVERT_EMPTY_PATH | GuzzleNormalizer::REMOVE_DEFAULT_HOST | GuzzleNormalizer::REMOVE_DEFAULT_PORT | GuzzleNormalizer::REMOVE_DOT_SEGMENTS | GuzzleNormalizer::REMOVE_DUPLICATE_SLASHES
        );
    }

    public static function dataUriNormalize(UriInterface $uri): UriInterface
    {
        return GuzzleNormalizer::normalize(
            $uri,
            GuzzleNormalizer::CAPITALIZE_PERCENT_ENCODING | GuzzleNormalizer::DECODE_UNRESERVED_CHARACTERS
        );
    }
}
