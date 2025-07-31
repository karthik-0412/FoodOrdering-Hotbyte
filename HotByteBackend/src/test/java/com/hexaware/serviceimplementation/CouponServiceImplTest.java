package com.hexaware.serviceimplementation;

//package com.hexaware.serviceImplementation;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import com.hexaware.dto.CouponDTO;
import com.hexaware.entity.Coupon;
import com.hexaware.enums.CouponStatus;
import com.hexaware.exceptions.ResourceNotFoundException;
import com.hexaware.mapper.CouponMapper;
import com.hexaware.repository.CouponRepository;
import com.hexaware.service.CouponService;
import com.hexaware.serviceImplementation.CouponServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class CouponServiceImplTest {

    @Mock
    private CouponRepository couponRepository;

    @Mock
    private CouponMapper couponMapper;

    @InjectMocks
    private CouponServiceImpl couponService;

    private Coupon coupon;
    private CouponDTO couponDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        coupon = new Coupon(1L, "SAVE10", "10% Off", "Get 10% off on orders", 10, 100.0, 50.0, 100, 5, LocalDate.now().plusDays(10), CouponStatus.ACTIVE);
        couponDTO = new CouponDTO(1L, "10% Off", "SAVE10", "Get 10% off on orders", 10, 100.0, 50.0, 100, 5, LocalDate.now().plusDays(10), CouponStatus.ACTIVE);
    }

    @Test
    void testCreateCoupon() {
        when(couponMapper.couponDtoToCoupon(any())).thenReturn(coupon);
        when(couponRepository.save(any())).thenReturn(coupon);
        when(couponMapper.couponToCouponDto(any())).thenReturn(couponDTO);

        CouponDTO result = couponService.createCoupon(couponDTO);

        assertNotNull(result);
        assertEquals("SAVE10", result.getCode());
        verify(couponRepository, times(1)).save(any());
    }

    @Test
    void testGetCouponById() {
        when(couponRepository.findById(1L)).thenReturn(Optional.of(coupon));
        when(couponMapper.couponToCouponDto(coupon)).thenReturn(couponDTO);

        CouponDTO result = couponService.getCouponById(1L);

        assertNotNull(result);
        assertEquals("SAVE10", result.getCode());
    }

    @Test
    void testGetCouponById_NotFound() {
        when(couponRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> couponService.getCouponById(1L));
    }

    @Test
    void testGetAllCoupons() {
        List<Coupon> coupons = Arrays.asList(coupon);
        List<CouponDTO> dtos = Arrays.asList(couponDTO);

        when(couponRepository.findAll()).thenReturn(coupons);
        when(couponMapper.couponToCouponDto(coupon)).thenReturn(couponDTO);

        List<CouponDTO> result = couponService.getAllCoupons();

        assertEquals(1, result.size());
        verify(couponRepository, times(1)).findAll();
    }

    @Test
    void testUpdateCoupon() {
        when(couponRepository.findById(1L)).thenReturn(Optional.of(coupon));
        when(couponRepository.save(any())).thenReturn(coupon);
        when(couponMapper.couponToCouponDto(any())).thenReturn(couponDTO);

        CouponDTO result = couponService.updateCoupon(1L, couponDTO);

        assertEquals("SAVE10", result.getCode());
        verify(couponRepository).save(any());
    }

    @Test
    void testUpdateCoupon_NotFound() {
        when(couponRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> couponService.updateCoupon(1L, couponDTO));
    }

    @Test
    void testDeleteCoupon() {
        when(couponRepository.existsById(1L)).thenReturn(true);

        couponService.deleteCoupon(1L);

        verify(couponRepository).deleteById(1L);
    }

    @Test
    void testDeleteCoupon_NotFound() {
        when(couponRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> couponService.deleteCoupon(1L));
    }

    @Test
    void testGetCouponByCode() {
        when(couponRepository.findByCode("SAVE10")).thenReturn(coupon);
        when(couponMapper.couponToCouponDto(coupon)).thenReturn(couponDTO);

        CouponDTO result = couponService.getCouponByCode("SAVE10");

        assertEquals("SAVE10", result.getCode());
    }
}
