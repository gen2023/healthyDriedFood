<?php
/**
 * @package     Joomla.Plugin
 * @subpackage  Jshoppingadmin.watermark
 * @author      Sofona
 * @license     GNU/GPL
 */

defined('_JEXEC') or die;

use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Factory;
use Joomla\CMS\Log\Log;
use Joomla\Component\Jshopping\Site\Lib\ImageLib;

class PlgJshoppingAdminWatermark extends CMSPlugin
{
    public function onAfterSaveProductImage($product_id, $name_full, $name_image = null, $name_thumb = null)
    {
        if ($name_image === null && $name_thumb === null) {
            $name_image = $name_full;
            $name_full  = 'full_' . $name_image;
            $name_thumb = 'thumb_' . $name_image;
        }

        $image1 = $this->normalizeImageParam($this->params->get('image1'));
        $image2 = $this->normalizeImageParam($this->params->get('image2'));
        $image3 = $this->normalizeImageParam($this->params->get('image3'));

        $padding_right  = (int) $this->params->get('padding_right', 5);
        $padding_bottom = (int) $this->params->get('padding_bottom', 5);
        $quality        = (int) $this->params->get('quality', 85);

        if ($image3) {
            $this->addWatermark($name_full, $image3, $padding_right, $padding_bottom, $quality);
        }
        if ($image2) {
            $this->addWatermark($name_image, $image2, $padding_right, $padding_bottom, $quality);
        }
        if ($image1) {
            $this->addWatermark($name_thumb, $image1, $padding_right, $padding_bottom, $quality);
        }
    }

    private function normalizeImageParam($value): string
    {
        return ($value === '-1') ? '' : (string) $value;
    }

    private function addWatermark(string $imagename, string $namewatermark, int $padding_right, int $padding_bottom, int $quality = 85): void
    {
        $jshopConfig = JSFactory::getConfig();

        $imagepath     = $jshopConfig->image_product_path . '/' . $imagename;
        $watermarkpath = JPATH_ROOT . '/images/' . $namewatermark;

        if (!file_exists($imagepath) || !file_exists($watermarkpath)) {
            return;
        }

        $imgext = strtolower(pathinfo($imagepath, PATHINFO_EXTENSION));
        $wmext  = strtolower(pathinfo($watermarkpath, PATHINFO_EXTENSION));

        $watermark = match ($wmext) {
            'jpg', 'jpeg' => imagecreatefromjpeg($watermarkpath),
            'gif'         => imagecreatefromgif($watermarkpath),
            'png'         => imagecreatefrompng($watermarkpath),
            default       => null,
        };

        if (!$watermark) {
            return;
        }

        [$imageWidth, $imageHeight] = getimagesize($imagepath);

        $maxW = (int) $this->params->get('width', 800);
        $maxH = (int) $this->params->get('height', 600);

        if ($imageWidth > $maxW || $imageHeight > $maxH) {
            $ratio = $imageHeight / $imageWidth;

            if ($imageWidth > $maxW) {
                $newW = $maxW;
                $newH = (int) round($newW * $ratio);
            } else {
                $newH = $maxH;
                $newW = (int) round($newH / $ratio);
            }

            if (!ImageLib::resizeImage($imagepath, $newW, $newH, $imagepath, 100)) {
                Log::add('Watermark resize error: ' . $imagepath, Log::WARNING, 'jshopping');
            }
        }

        $image = match ($imgext) {
            'jpg', 'jpeg' => imagecreatefromjpeg($imagepath),
            'gif'         => imagecreatefromgif($imagepath),
            'png'         => imagecreatefrompng($imagepath),
            default       => null,
        };

        if (!$image) {
            imagedestroy($watermark);
            return;
        }

        $wmW = imagesx($watermark);
        $wmH = imagesy($watermark);

        // Центр
        $dest_x = (imagesx($image) - $wmW) / 2;
        $dest_y = (imagesy($image) - $wmH) / 2;

        imagecopyresampled(
            $image,
            $watermark,
            (int) $dest_x,
            (int) $dest_y,
            0,
            0,
            $wmW,
            $wmH,
            $wmW,
            $wmH
        );

        match ($imgext) {
            'jpg', 'jpeg' => imagejpeg($image, $imagepath, $quality),
            'gif'         => imagegif($image, $imagepath),
            'png'         => imagepng($image, $imagepath, 10 - max((int) ($quality / 10), 1)),
        };

        imagedestroy($image);
        imagedestroy($watermark);
    }
}
