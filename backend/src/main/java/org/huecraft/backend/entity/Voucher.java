package org.huecraft.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.*;
import org.huecraft.backend.entity.base.BaseAuditable;
import org.huecraft.backend.entity.enums.DiscountType;
import org.huecraft.backend.entity.enums.VoucherSource;

@Entity
@Table(name = "vouchers", indexes = {
        @Index(name = "uk_voucher_code", columnList = "code", unique = true)
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Voucher extends BaseAuditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", nullable = false, length = 100, unique = true)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", length = 20, nullable = false)
    private DiscountType discountType;

    @Column(name = "discount_value", precision = 19, scale = 2, nullable = false)
    private BigDecimal discountValue;

    @Column(name = "valid_from")
    private Instant validFrom;

    @Column(name = "valid_to")
    private Instant validTo;

    @Column(name = "usage_limit")
    private Integer usageLimit;

    @Enumerated(EnumType.STRING)
    @Column(name = "source", length = 30)
    private VoucherSource source;
}
