import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  Timeline,
  TimelineSeparator,
  TimelineItem,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  timelineOppositeContentClasses,
} from "@mui/lab";
import {
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Box,
} from "@mui/material";
import { useRef } from "react";
import { Marker as LeafletMarker } from "leaflet";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { dateSections, miyakeCenter, type Item } from "./ryotei";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// dateSectionsの全itemsをフラット化してマーカー参照を管理
const allItemsWithPosition = dateSections
  .flatMap((section) =>
    section.items.map((item) => (item.position ? item : null))
  )
  .filter(Boolean) as Required<Item>[];

// LeafletのデフォルトアイコンのパスをViteビルド後も正しく参照できるように設定
const DefaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function MiyakeMap() {
  const markerRefs = useRef<(LeafletMarker | null)[]>([]);

  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      width="100%"
      sx={{ minHeight: "100vh" }}
    >
      <Grid
        size={{ xs: 12, md: 7 }}
        sx={{
          position: "sticky",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 900 }}>
          <MapContainer
            center={miyakeCenter}
            zoom={12}
            style={{ height: "600px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {allItemsWithPosition.map((item, idx) => (
              <Marker
                key={idx}
                position={item.position}
                ref={(ref) => {
                  markerRefs.current[idx] =
                    ref && "openPopup" in ref ? ref : null;
                }}
              >
                <Popup>
                  <b>{item.time}</b> {item.label}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Box>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Typography variant="h6" gutterBottom>
          工程表タイムライン
        </Typography>

        {dateSections.map((section) => (
          <Accordion key={section.date} defaultExpanded={false}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" color="primary">
                {section.date}
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Stack sx={{ justifyContent: "flex-start" }}>
                <Timeline
                  position="right"
                  sx={{
                    mt: 0,
                    mb: 0,
                    pt: 0,
                    pb: 0,
                    [`& .${timelineOppositeContentClasses.root}`]: {
                      flex: 0.2,
                    },
                  }}
                >
                  {section.items.map((item, idx) => {
                    const markerIdx = allItemsWithPosition.findIndex(
                      (it) => it.time === item.time && it.label === item.label
                    );
                    const hasMarker = markerIdx !== -1;
                    return (
                      <TimelineItem key={idx}>
                        <TimelineOppositeContent>
                          <Typography variant="body2">{item.time}</Typography>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot color="primary" />
                          {idx < section.items.length - 1 && (
                            <TimelineConnector />
                          )}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography
                            variant="body1"
                            sx={{
                              cursor: hasMarker ? "pointer" : "default",
                              textDecoration: hasMarker ? "underline" : "none",
                            }}
                            onClick={() => {
                              if (hasMarker && markerRefs.current[markerIdx]) {
                                markerRefs.current[markerIdx]?.openPopup();
                              }
                            }}
                          >
                            {item.label}
                          </Typography>
                        </TimelineContent>
                      </TimelineItem>
                    );
                  })}
                </Timeline>
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Grid>
    </Grid>
  );
}
