import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import SearchLocation from "../test/SearchLocation";
import GetDeviceID from "../test/getDeviceID";
import GoodsCluster from "../test/GoodsCluster";

const TestLink = () => {
  return (
    <div>
      <Routes>
        <Route path="/search-location" element={<SearchLocation />} />
        <Route path="/get-device-id" element={<GetDeviceID />} />
        <Route path="/GoodsCluster" element={<GoodsCluster />} />
      </Routes>
    </div>
  );
};

export default TestLink;
