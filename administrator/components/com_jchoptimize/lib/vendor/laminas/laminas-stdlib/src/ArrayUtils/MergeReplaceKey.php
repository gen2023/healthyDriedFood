<?php

declare(strict_types=1);

namespace _JchOptimizeVendor\V91\Laminas\Stdlib\ArrayUtils;

final class MergeReplaceKey implements MergeReplaceKeyInterface
{
    public function __construct(protected mixed $data)
    {
    }
    /**
     * {@inheritDoc}
     */
    public function getData()
    {
        return $this->data;
    }
}
