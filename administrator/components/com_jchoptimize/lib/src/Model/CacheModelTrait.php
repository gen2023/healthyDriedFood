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

namespace JchOptimize\Core\Model;

use Exception;
use FilesystemIterator;
use JchOptimize\Core\Helper;
use JchOptimize\Platform\Cache;
use JchOptimize\Platform\Paths;
use Joomla\Filesystem\Folder;
use _JchOptimizeVendor\Laminas\Cache\Exception\ExceptionInterface;
use _JchOptimizeVendor\Laminas\Cache\Storage\Adapter\Filesystem;
use _JchOptimizeVendor\Laminas\Cache\Storage\Adapter\FilesystemOptions;
use _JchOptimizeVendor\Laminas\Cache\Storage\ClearByNamespaceInterface;
use _JchOptimizeVendor\Laminas\Cache\Storage\FlushableInterface;
use _JchOptimizeVendor\Laminas\Cache\Storage\IterableInterface;
use _JchOptimizeVendor\Laminas\Cache\Storage\OptimizableInterface;
use _JchOptimizeVendor\Laminas\Cache\Storage\StorageInterface;
use _JchOptimizeVendor\Laminas\Cache\Storage\TaggableInterface;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

use function defined;
use function file_exists;
use function filesize;
use function floor;
use function in_array;
use function is_array;
use function iterator_count;
use function md5;
use function number_format;
use function pow;
use function sprintf;
use function str_split;
use function strlen;

defined('_JCH_EXEC') or die('Restricted access');
trait CacheModelTrait
{
    protected int $size = 0;
    protected int $numFiles = 0;
    public function getCacheSize(): array
    {
        /** @var StorageInterface $cache */
        $cache = $this->getContainer()->get(StorageInterface::class);
        /** @var StorageInterface $pageCacheStorage */
        $pageCacheStorage = $this->pageCache->getStorage();
        if ($cache instanceof IterableInterface) {
            $this->getIterableCacheSize($cache);
        }
        if ($pageCacheStorage instanceof IterableInterface) {
            $this->getIterableCacheSize($pageCacheStorage);
        }
        //Iterate through the static files
        if (file_exists(Paths::cachePath(\false))) {
            $directory = new RecursiveDirectoryIterator(Paths::cachePath(\false), FilesystemIterator::SKIP_DOTS);
            $iterator = new RecursiveIteratorIterator($directory);
            $i = 0;
            foreach ($iterator as $file) {
                if (in_array($file->getFilename(), ['index.html', '.htaccess'])) {
                    $i++;
                    continue;
                }
                $this->size += $file->getSize();
            }
            $this->numFiles += iterator_count($iterator) - $i;
        }
        $decimals = 2;
        $sz = 'BKMGTP';
        $factor = (int) floor((strlen((string) $this->size) - 1) / 3);
        $size = sprintf("%.{$decimals}f", $this->size / pow(1024, $factor)) . str_split($sz)[$factor];
        $numFiles = number_format($this->numFiles);
        return [$size, $numFiles];
    }
    private function getIterableCacheSize($cache): void
    {
        try {
            $iterator = $cache->getIterator();
            $this->numFiles += iterator_count($iterator);
            foreach ($iterator as $item) {
                //Let's skip the 'test' cache set on instantiation in container
                if ($item == md5('__ITEM__')) {
                    $this->numFiles -= 1;
                    continue;
                }
                $metaData = $cache->getMetadata($item);
                if (!is_array($metaData)) {
                    continue;
                }
                if (isset($metaData['size'])) {
                    $this->size += $metaData['size'];
                } elseif ($cache instanceof Filesystem) {
                    /** @var FilesystemOptions $cacheOptions */
                    $cacheOptions = $cache->getOptions();
                    $suffix = $cacheOptions->getSuffix();
                    if (isset($metaData['filespec']) && file_exists($metaData['filespec'] . '.' . $suffix)) {
                        $this->size += filesize($metaData['filespec'] . '.' . $suffix);
                    }
                }
            }
        } catch (ExceptionInterface | Exception $e) {
        }
    }
    /**
     * Cleans cache from the server
     *
     * @return bool
     */
    public function cleanCache(): bool
    {
        /** @var TaggableInterface&OptimizableInterface $taggableCache */
        $taggableCache = $this->getContainer()->get(TaggableInterface::class);
        /** @var StorageInterface $cache */
        $cache = $this->getContainer()->get(StorageInterface::class);
        /** @var StorageInterface $pageCacheStorage */
        $pageCacheStorage = $this->pageCache->getStorage();
        $success = 1;
        //First try to delete the Http request cache
        //Delete any static combined files
        $staticCachePath = Paths::cachePath(\false);
        try {
            if (file_exists($staticCachePath)) {
                Folder::delete($staticCachePath);
            }
        } catch (Exception $e) {
            try {
                //Didn't work, Joomla can't handle paths containing backslash, let's try another way
                Helper::deleteFolder($staticCachePath);
            } catch (Exception $e) {
            }
        }
        $success &= (int) (!file_exists($staticCachePath));
        try {
            //Clean all cache generated by Storage
            if ($cache instanceof ClearByNamespaceInterface) {
                $success &= (int) $cache->clearByNamespace(Cache::getGlobalCacheNamespace());
            } elseif ($cache instanceof FlushableInterface) {
                $success &= (int) $cache->flush();
            }
            if ($cache instanceof OptimizableInterface) {
                $cache->optimize();
            }
            //And page cache
            if ($pageCacheStorage instanceof ClearByNamespaceInterface) {
                $success &= (int) $pageCacheStorage->clearByNamespace(Cache::getPageCacheNamespace());
            } elseif ($cache instanceof FlushableInterface) {
                $success &= (int) $this->pageCache->deleteAllItems();
            }
            if ($pageCacheStorage instanceof OptimizableInterface) {
                $pageCacheStorage->optimize();
            }
        } catch (Exception) {
            $success = \false;
        }
        //If all goes well, also delete tags
        if ($success) {
            if ($taggableCache instanceof ClearByNamespaceInterface) {
                $taggableCache->clearByNamespace(Cache::getTaggableCacheNamespace());
            } elseif ($taggableCache instanceof FlushableInterface) {
                $taggableCache->flush();
            }
            $taggableCache->optimize();
        }
        //Clean third party cache
        Cache::cleanThirdPartyPageCache();
        return (bool) $success;
    }
}
