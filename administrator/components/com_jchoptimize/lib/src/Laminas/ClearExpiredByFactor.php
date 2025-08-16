<?php

/**
 * JCH Optimize - Performs several front-end optimizations for fast downloads
 *
 * @package   jchoptimize/core
 * @author    Samuel Marshall <samuel@jch-optimize.net>
 * @copyright Copyright (c) 2022 Samuel Marshall / JCH Optimize
 * @license   GNU/GPLv3, or later. See LICENSE file
 *
 *  If LICENSE file missing, see <http://www.gnu.org/licenses/>.
 */

namespace JchOptimize\Core\Laminas;

use _JchOptimizeVendor\V91\Joomla\Filesystem\File;
use _JchOptimizeVendor\V91\Laminas\Cache\Exception\ExceptionInterface;
use _JchOptimizeVendor\V91\Laminas\Cache\Storage\IterableInterface;
use _JchOptimizeVendor\V91\Laminas\Cache\Storage\OptimizableInterface;
use _JchOptimizeVendor\V91\Laminas\Cache\Storage\StorageInterface;
use _JchOptimizeVendor\V91\Laminas\Cache\Storage\TaggableInterface;
use _JchOptimizeVendor\V91\Psr\Log\LoggerAwareInterface;
use _JchOptimizeVendor\V91\Psr\Log\LoggerAwareTrait;
use Exception;
use JchOptimize\Core\PageCache\PageCache;
use JchOptimize\Core\Platform\CacheInterface;
use JchOptimize\Core\Platform\PathsInterface;
use JchOptimize\Core\Platform\ProfilerInterface;
use JchOptimize\Core\Registry;
use JchOptimize\Core\Uri\Utils;
use Throwable;

use function defined;
use function file_exists;
use function is_array;
use function random_int;
use function time;

use const JCH_DEBUG;

defined('_JCH_EXEC') or die('Restricted access');

class ClearExpiredByFactor implements LoggerAwareInterface
{
    use LoggerAwareTrait;

    public const FLAG = '__CLEAR_EXPIRED_BY_FACTOR_RUNNING__';

    private int $clearingFactor = 10;

    public function __construct(
        private Registry $params,
        private StorageInterface $cacheStorage,
        /**
         * @var StorageInterface&TaggableInterface&IterableInterface&OptimizableInterface
         */
        private $taggableCache,
        private PageCache $pageCache,
        private PathsInterface $paths,
        private CacheInterface $cacheUtils,
        private ProfilerInterface $profiler,
    ) {
    }

    /**
     * @throws Exception
     * @throws ExceptionInterface
     */
    public function clearExpiredByFactor(): void
    {
        if (
            $this->params->get('delete_expiry', '0')
            && $this->clearingFactor
            && random_int(1, $this->clearingFactor) === 1
        ) {
            $this->clearExpired();
        }
    }

    public static function getFlagId(): string
    {
        return md5(self::FLAG);
    }

    /**
     * @throws ExceptionInterface
     */
    private function clearExpired(): void
    {
        !JCH_DEBUG ?: $this->profiler->start('ClearExpired');

        $pageCacheStorage = $this->pageCache->getStorage();

        try {
            //If plugin already running in another instance, abort
            if ($pageCacheStorage->hasItem(self::getFlagId())) {
                return;
            } else {
                //else set flag to disable page caching while running to prevent
                //errors with race conditions
                $pageCacheStorage->setItem(self::getFlagId(), self::FLAG);
            }
        } catch (ExceptionInterface) {
            //just return if this didn't work. We'll try again next time
            return;
        }

        $ttl = $this->cacheStorage->getOptions()->getTtl();
        $pageCacheTtl = $pageCacheStorage->getOptions()->getTtl();
        $time = time();
        $itemDeletedFlag = false;

        foreach ($this->taggableCache as $item) {
            $metaData = $this->taggableCache->getMetadata($item);

            if (!is_array($metaData) || empty($metaData)) {
                continue;
            }

            $tags = $this->taggableCache->getTags($item);

            if (!is_array($tags) || empty($tags)) {
                continue;
            }

            $mtime = (int)$metaData['mtime'];

            if ($tags[0] == 'pagecache') {
                if ($mtime && $time > $mtime + $pageCacheTtl) {
                    $this->pageCache->deleteItemById($item);
                }

                continue;
            }

            if ($mtime && $time > $mtime + $ttl) {
                foreach ($tags as $pageCacheUrl) {
                    $pageCacheId = $this->pageCache->getPageCacheId(Utils::uriFor($pageCacheUrl));

                    if (!$this->pageCache->deleteItemById($pageCacheId)) {
                        continue 2;
                    }
                }

                $this->cacheStorage->removeItem($item);
                $deleteTag = !$this->cacheStorage->hasItem($item);

                if ($deleteTag) {
                    $itemDeletedFlag = true;
                }
                //We need to also delete the static css/js file if that option is set
                if ($this->params->get('htaccess', '2') == '2') {
                    $files = [
                        $this->paths->cachePath(false) . '/css/' . $item . '.css',
                        $this->paths->cachePath(false) . '/js/' . $item . '.js'
                    ];

                    try {
                        foreach ($files as $file) {
                            if (file_exists($file)) {
                                File::delete($file);

                                //If for some reason the file still exists don't delete tags
                                if (file_exists($file)) {
                                    $deleteTag = false;
                                }

                                break;
                            }
                        }
                    } catch (Throwable) {
                        //Don't bother to delete the tags if this didn't work
                        $deleteTag = false;
                    }
                }

                if ($deleteTag) {
                    $this->taggableCache->removeItem($item);
                }
            }
        }

        if ($itemDeletedFlag) {
            //Finally attempt to clean any third party page cache
            $this->cacheUtils->cleanThirdPartyPageCache();
        }

        !JCH_DEBUG ?: $this->profiler->stop('ClearExpired', true);

        //remove flag
        $pageCacheStorage->removeItem(self::getFlagId());

        if ($this->cacheStorage instanceof OptimizableInterface) {
            $this->cacheStorage->optimize();
        }

        if ($pageCacheStorage instanceof OptimizableInterface) {
            $pageCacheStorage->optimize();
        }

        $this->taggableCache->optimize();
    }

    public function setClearingFactor(int $clearingFactor): ClearExpiredByFactor
    {
        $this->clearingFactor = $clearingFactor;
        return $this;
    }
}
